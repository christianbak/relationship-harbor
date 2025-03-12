
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  useEffect(() => {
    // Check for OAuth code in URL
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const state = query.get("state");
    const error = query.get("error");
    
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    // Process OAuth code grant
    if (code && state) {
      processOAuthCode(code);
    }
  }, [location]);
  
  const processOAuthCode = async (code: string) => {
    setIsProcessingOAuth(true);
    setIsLoading(true);
    
    try {
      // Get the redirect URI - should match the one used to generate the authorization URL
      const redirectUri = `${window.location.origin}/login`;
      
      // Exchange code for token
      const authResponse = await authService.exchangeCodeForToken({
        code,
        redirectUri,
      });
      
      // Store tokens and user info
      login(
        authResponse.accessToken,
        authResponse.refreshToken,
        authResponse.user
      );
      
      // Redirect to dashboard
      navigate("/dashboard");
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("OAuth code exchange error:", error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOAuth(false);
      setIsLoading(false);
    }
  };
  
  const handleOAuthLogin = () => {
    setIsLoading(true);
    
    try {
      // Generate a random state parameter for CSRF protection
      const state = Math.random().toString(36).substring(2, 15);
      
      // Store the state in localStorage for verification when the user returns
      localStorage.setItem("oauth_state", state);
      
      // Redirect to the OAuth provider's authorization URL
      const redirectUri = `${window.location.origin}/login`;
      const authUrl = authService.getAuthorizationUrl(redirectUri, state);
      window.location.href = authUrl;
    } catch (error) {
      console.error("OAuth redirect error:", error);
      setIsLoading(false);
      toast({
        title: "Login Error",
        description: "Failed to redirect to login provider",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Sign In</h2>
        <p className="text-sm text-muted-foreground">
          Access your customer management dashboard
        </p>
      </div>
      
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleOAuthLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Sign In with OAuth</span>
              </>
            )}
          </Button>
        </motion.div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Secure Authentication
            </span>
          </div>
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
