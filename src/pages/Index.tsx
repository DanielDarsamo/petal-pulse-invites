import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Sparkles, Users } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-pink-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              WebInvite
            </span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline">
            Sign In
          </Button>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Beautiful Wedding
              <br />
              Invitations
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create stunning, personalized wedding invitations with custom music, events, and guest management.
            </p>
          </div>

          <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Create Your Invitation
          </Button>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold">Visual Customization</h3>
              <p className="text-muted-foreground">
                Upload custom backgrounds, adjust colors and opacity
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Music & Events</h3>
              <p className="text-muted-foreground">
                Add background music and manage your event schedule
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Guest Management</h3>
              <p className="text-muted-foreground">
                Track RSVPs and send personalized invitation links
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;