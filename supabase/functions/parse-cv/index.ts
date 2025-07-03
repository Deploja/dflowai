
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvText, cvId, userId } = await req.json();

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting CV parsing for CV ID:', cvId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that extracts information from CVs and returns structured data in JSON format. 
            Extract the following information from the CV:
            - first_name: First name
            - surname: Last name
            - email: Email address
            - phone: Phone number
            - title: Job/role title
            - location: Location/city
            - skills: Array of skills mentioned (extract programming languages, technologies, frameworks, etc.)
            - experience_summary: A brief summary of competencies and experience
            - linkedin: LinkedIn profile URL if mentioned
            - github: GitHub profile URL if mentioned
            - portfolio: Portfolio/website URL if mentioned
            
            Return only valid JSON without extra text.`
          },
          {
            role: 'user',
            content: `Extract information from this CV:\n\n${cvText}`
          }
        ],
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const extractedInfo = JSON.parse(data.choices[0].message.content);
    console.log('Extracted info:', extractedInfo);

    // Store parsing results
    const { error: parsingError } = await supabase
      .from('cv_parsing_results')
      .insert({
        cv_id: cvId,
        user_id: userId,
        extracted_data: extractedInfo,
        parsing_status: 'completed'
      });

    if (parsingError) {
      console.error('Error storing parsing results:', parsingError);
    }

    // Update CV with parsed data and mark as parsed
    const { error: cvUpdateError } = await supabase
      .from('cvs')
      .update({
        is_parsed: true,
        parsed_data: extractedInfo
      })
      .eq('id', cvId);

    if (cvUpdateError) {
      console.error('Error updating CV:', cvUpdateError);
    }

    // Update user presentation with experience summary
    if (extractedInfo.experience_summary) {
      const { error: presentationError } = await supabase
        .from('user_presentations')
        .upsert({
          user_id: userId,
          title: 'Professional Summary',
          content: extractedInfo.experience_summary
        });

      if (presentationError) {
        console.error('Error updating presentation:', presentationError);
      }
    }

    // Add skills to user skills table
    if (extractedInfo.skills && Array.isArray(extractedInfo.skills)) {
      for (const skill of extractedInfo.skills) {
        await supabase
          .from('user_skills')
          .upsert({
            user_id: userId,
            skill_name: skill,
            skill_type: 'programming',
            proficiency_level: 'intermediate',
            years_experience: 0
          });
      }
    }

    // Update profile with contact information
    const profileUpdates: any = {};
    if (extractedInfo.first_name) profileUpdates.first_name = extractedInfo.first_name;
    if (extractedInfo.surname) profileUpdates.last_name = extractedInfo.surname;
    if (extractedInfo.email) profileUpdates.email = extractedInfo.email;
    if (extractedInfo.phone) profileUpdates.phone = extractedInfo.phone;
    if (extractedInfo.title) profileUpdates.title = extractedInfo.title;
    if (extractedInfo.location) profileUpdates.location = extractedInfo.location;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileUpdates
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      extractedInfo,
      message: 'CV parsed and profile updated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in parse-cv function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
