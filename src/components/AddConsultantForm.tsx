
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Upload, FileText, X, Loader2 } from "lucide-react";

const consultantSchema = z.object({
  first_name: z.string().min(1, "Förnamn krävs"),
  surname: z.string().min(1, "Efternamn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  title: z.string().min(1, "Titel krävs"),
  location: z.string().min(1, "Plats krävs"),
  availability: z.string().default("Available"),
  experience_years: z.number().min(0).default(0),
  hourly_rate: z.number().min(0).default(0),
  skills: z.array(z.string()).default([]),
});

type ConsultantFormData = z.infer<typeof consultantSchema>;

interface AddConsultantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddConsultantForm({ open, onOpenChange, onSuccess }: AddConsultantFormProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingCV, setIsProcessingCV] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ConsultantFormData>({
    resolver: zodResolver(consultantSchema),
    defaultValues: {
      first_name: "",
      surname: "",
      email: "",
      phone: "",
      title: "",
      location: "",
      availability: "Available",
      experience_years: 0,
      hourly_rate: 0,
      skills: [],
    },
  });

  const processCV = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const text = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('parse-cv', {
          body: { cvText: text }
        });
        
        if (error) throw error;
        
        // Fill form with extracted data
        const extractedData = data;
        form.reset({
          ...form.getValues(),
          first_name: extractedData.first_name || "",
          surname: extractedData.surname || "",
          email: extractedData.email || "",
          phone: extractedData.phone || "",
          title: extractedData.title || "",
          location: extractedData.location || "",
        });
        
        if (extractedData.skills) {
          setSkillsInput(extractedData.skills.join(", "));
          form.setValue("skills", extractedData.skills);
        }
        
        toast({
          title: "CV Bearbetat",
          description: "AI har fyllt i formuläret baserat på CV:t",
        });
      };
      
      fileReader.readAsText(file);
    } catch (error) {
      console.error("Error processing CV:", error);
      toast({
        title: "Fel vid bearbetning",
        description: "Kunde inte bearbeta CV:t automatiskt",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      toast({
        title: "Fel filformat",
        description: "Endast PDF och Word-dokument stöds",
        variant: "destructive",
      });
      return;
    }

    setCvFile(file);
    setIsProcessingCV(true);

    try {
      await processCV(file);
    } catch (error) {
      console.error("Error processing CV:", error);
      toast({
        title: "Fel vid bearbetning",
        description: "Kunde inte bearbeta CV:t automatiskt",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSkillsChange = (value: string) => {
    setSkillsInput(value);
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    form.setValue("skills", skillsArray);
  };

  const onSubmit = async (data: ConsultantFormData) => {
    if (!user) {
      toast({
        title: "Fel",
        description: "Du måste vara inloggad för att lägga till konsulter",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload CV file if present
      let cvFilePath = null;
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(fileName, cvFile);

        if (uploadError) {
          console.error("CV upload error:", uploadError);
          throw new Error("Failed to upload CV file");
        }
        
        cvFilePath = fileName;
      }

      // Insert consultant data matching the database schema
      const { error } = await supabase
        .from('consultants')
        .insert({
          first_name: data.first_name,
          surname: data.surname,
          email: data.email,
          phone: data.phone || null,
          title: data.title,
          location: data.location,
          availability: data.availability,
          experience_years: data.experience_years,
          hourly_rate: data.hourly_rate,
          skills: data.skills,
        });

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      toast({
        title: "Konsult tillagd",
        description: "Konsulten har lagts till framgångsrikt",
      });

      form.reset();
      setCvFile(null);
      setSkillsInput("");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding consultant:", error);
      toast({
        title: "Fel",
        description: error instanceof Error ? error.message : "Kunde inte lägga till konsulten",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Lägg till ny konsult
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Fyll i konsultens information eller ladda upp ett CV för automatisk ifyllning
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* CV Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                CV Upload
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver
                    ? 'border-gray-400 bg-gray-50 dark:bg-gray-800'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {cvFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {cvFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCvFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Dra och släpp CV här eller{" "}
                      <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                        välj fil
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF eller Word-dokument</p>
                  </div>
                )}
              </div>

              {isProcessingCV && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI bearbetar CV:t...</span>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Förnamn *</FormLabel>
                    <FormControl>
                      <Input placeholder="Förnamn" {...field} className="glass" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efternamn *</FormLabel>
                    <FormControl>
                      <Input placeholder="Efternamn" {...field} className="glass" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-post *</FormLabel>
                    <FormControl>
                      <Input placeholder="exempel@email.com" {...field} className="glass" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input placeholder="+46 70 123 45 67" {...field} className="glass" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titel/Roll *</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Developer" {...field} className="glass" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plats *</FormLabel>
                    <FormControl>
                      <Input placeholder="Stockholm" {...field} className="glass" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tillgänglighet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass">
                          <SelectValue placeholder="Välj tillgänglighet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Available">Tillgänglig</SelectItem>
                        <SelectItem value="Busy">Upptagen</SelectItem>
                        <SelectItem value="Unavailable">Ej tillgänglig</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>År av erfarenhet</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="glass" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourly_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timtaxa (SEK)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="800" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="glass" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kompetenser</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, TypeScript, Node.js (separera med komma)"
                      value={skillsInput}
                      onChange={(e) => handleSkillsChange(e.target.value)}
                      className="glass"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="glass"
              >
                Avbryt
              </Button>
              <Button 
                type="submit" 
                disabled={isProcessingCV || isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-black"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sparar...
                  </>
                ) : (
                  "Lägg till konsult"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
