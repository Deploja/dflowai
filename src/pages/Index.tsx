
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/AuthProvider";
import { 
  Sparkles, 
  Users, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  LogIn,
  UserPlus
} from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Users,
      title: "AI-Matching",
      description: "Intelligent matching of consultants with Microsoft Graph and JobTech API"
    },
    {
      icon: MessageSquare,
      title: "Smart Messaging",
      description: "Automated message flow with AI-generated texts and SMS"
    },
    {
      icon: Users,
      title: "CV Management",
      description: "AI-generated CVs with multilingual translation and export"
    },
    {
      icon: Calendar,
      title: "Resource Planning",
      description: "Drag-and-drop calendar with intelligent utilization analysis"
    },
    {
      icon: BarChart3,
      title: "Analytics & KPIs",
      description: "Real-time data with forecasts and financial tracking"
    },
    {
      icon: Shield,
      title: "Secure Sharing",
      description: "Partner network with controlled access and tracking"
    }
  ];

  const testimonials = [
    {
      name: "Emma Anderson",
      role: "CEO, TechConsult AB",
      content: "DflowAI has revolutionized our consultant brokerage. AI matching saves us hours every day.",
      rating: 5
    },
    {
      name: "Marcus Johansson",
      role: "HR Manager, InnovateIT",
      content: "Fantastic platform! The automation of CV management and message flow is worth its weight in gold.",
      rating: 5
    },
    {
      name: "Lisa Chen",
      role: "Project Manager, CodeExperts",
      content: "The best investment we've made. Resource planning has never been easier.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 relative">
      {/* Hero Section with Ocean Background covering full viewport */}
      <section className="relative h-screen ocean-hero">
        <div className="absolute inset-0 deploja-gradient"></div>
        
        {/* Header with Navigation - positioned over hero */}
        <header className="absolute top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-white font-deploja tracking-wider">
                    DFLOW
                  </span>
                  <Sparkles className="h-5 w-5 text-white/80" />
                  <span className="text-2xl font-bold text-white/90 font-deploja tracking-wider">AI</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="flex items-center space-x-3">
                  <Link to="/auth">
                    <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 font-medium">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-in text-white">
              <div className="text-sm text-white/80 mb-4 font-sans">
                Consulting Services in IT, Tech & Management
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 tracking-tight hero-title">
                Welcome to a
              </h1>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 tracking-tight hero-title-italic">
                Freer life as a consultant
              </h2>
              
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl leading-relaxed font-light font-sans">
                As an employed consultant at DflowAI, you as a consultant get to experience an unbeatable feeling of freedom! Here you are not just an employee, but also as close to an entrepreneur as you can get. Explore a world of possibilities and independence, with all the benefits that come with being part of our dynamic team!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-10 py-4 text-lg rounded-lg border-0">
                  Need consulting services?
                </Button>
                
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-10 py-4 text-lg font-semibold rounded-lg">
                  Work at DflowAI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-zinc-900/30 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100 font-deploja">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              Discover how DflowAI transforms the consulting industry with intelligent automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="glass dark:glass-dark border-gray-200/50 dark:border-gray-800/50 group transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gray-900 dark:bg-gray-100 p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-full h-full text-white dark:text-black" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100 font-deploja">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              Over 500+ companies trust DflowAI for their consultant brokerage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass dark:glass-dark border-gray-200/50 dark:border-gray-800/50 text-center">
                <CardHeader>
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-400 fill-current" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic mb-6 text-gray-600 dark:text-gray-400">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-zinc-900/30 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass dark:glass-dark border-gray-200/50 dark:border-gray-800/50 p-12">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100 font-deploja">
                Ready to Revolutionize Your Business?
              </CardTitle>
              <CardDescription className="text-xl mb-8 text-gray-600 dark:text-gray-400 font-light">
                Start your journey with DflowAI today and see the difference AI can make
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/auth">
                  <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-black font-semibold px-12 py-4 text-lg rounded-xl">
                    Start Free Demo
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-12 py-4 text-lg font-semibold rounded-xl">
                  Contact Sales Team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                  No commitment
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                  24/7 Support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                  14 days free
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 glass dark:glass-dark relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100 font-deploja tracking-wider">
                DFLOW
              </span>
              <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-xl font-bold text-gray-700 dark:text-gray-300 font-deploja tracking-wider">AI</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-500">
            © 2024 DflowAI. The future of consulting is here.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
