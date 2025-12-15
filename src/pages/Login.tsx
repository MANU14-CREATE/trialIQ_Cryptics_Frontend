import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Beaker, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("provider");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Validation schemas
  const emailSchema = z.string().email("Invalid email format").max(255, "Email too long");

  const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

  const roleSchema = z.enum(['super-admin', 'multi-site-management', 'sponsor', 'site', 'provider'], {
    errorMap: () => ({ message: "Please select a valid role" })
  });

  useEffect(() => {
    // Check if user is already logged in
    authService.getUser().then((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    // Listen for auth changes
    const unsubscribe = authService.onAuthChange((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate inputs
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        setError(emailValidation.error.errors[0].message);
        setLoading(false);
        return;
      }

      const passwordValidation = passwordSchema.safeParse(password);
      if (!passwordValidation.success) {
        setError(passwordValidation.error.errors[0].message);
        setLoading(false);
        return;
      }

      const roleValidation = roleSchema.safeParse(selectedRole);
      if (!roleValidation.success) {
        setError(roleValidation.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { user, error } = await authService.signUp(email, password, selectedRole);

      if (error || !user) {
        throw new Error(error || "Failed to create account");
      }

      toast({
        title: "Account created!",
        description: "You can now sign in with your credentials.",
      });

    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate email format
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success) {
        setError(emailValidation.error.errors[0].message);
        setLoading(false);
        return;
      }

      // Basic password check (not full validation for login)
      if (!password || password.length < 6) {
        setError("Password is required");
        setLoading(false);
        return;
      }
      const { user, error } = await authService.signIn(email, password);
      if (error || !user) {
        throw new Error(error || "Invalid email or password. Please check your credentials and try again.");
      }
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      setError(error.message || "Failed to sign in. Please try again.");
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const { error } = await authService.resetPassword(resetEmail);

      if (error) throw new Error(error);

      toast({
        title: "Password reset email sent!",
        description: "Check your email for the password reset link.",
      });

      setIsResetDialogOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative flex bg-background min-h-screen overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="top-0 right-0 absolute bg-primary/5 blur-3xl rounded-full w-[600px] h-[600px]" />
        <div className="bottom-0 left-0 absolute bg-accent/5 blur-3xl rounded-full w-[500px] h-[500px]" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden relative lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary-dark p-12 lg:w-1/2 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        
        <div className="z-10 relative animate-fade-in">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm rounded-xl w-12 h-12">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-2xl">Trial IQ</h1>
              <p className="text-white/70 text-sm">Clinical Trial Management</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="font-bold text-white text-4xl leading-tight">
              Streamline Your<br />Clinical Research<br />Workflow
            </h2>
            <p className="max-w-md text-white/80 text-lg leading-relaxed">
              Manage trials, track patient enrollment, and collaborate with sites — all in one powerful platform.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="z-10 relative gap-4 grid grid-cols-3">
          {[
            { label: 'Active Patients', value: '10K+' },
            { label: 'Clinical Trials', value: '500+' },
            { label: 'Research Sites', value: '200+' },
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm p-4 border border-white/10 rounded-xl transition-colors duration-300"
            >
              <div className="font-bold text-white text-2xl">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="relative flex flex-1 justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="flex justify-center items-center bg-primary mb-3 rounded-xl w-14 h-14">
              <Beaker className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-bold text-foreground text-2xl">Trial IQ</h1>
            <p className="text-muted-foreground text-sm">Clinical Trial Management</p>
          </div>

          <Card className="bg-card shadow-lg border border-border">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="font-semibold text-foreground text-2xl">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid grid-cols-2 bg-muted/50 mb-6 w-full">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    
                    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="w-full text-muted-foreground hover:text-primary text-sm">
                          Forgot password?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card">
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>
                            Enter your email address and we'll send you a link to reset your password.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="name@example.com"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setIsResetDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="flex-1" disabled={resetLoading}>
                              {resetLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <p className="text-muted-foreground text-xs">
                        Password must be at least 8 characters and contain uppercase, lowercase, number, and special character
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Select Your Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger id="role" className="bg-background">
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          <SelectItem value="super-admin">Super Admin (Full System Access)</SelectItem>
                          <SelectItem value="multi-site-management">Multi-Site Manager</SelectItem>
                          <SelectItem value="sponsor">Sponsor (Pharmaceutical Company)</SelectItem>
                          <SelectItem value="site">Site Admin (Clinical Site)</SelectItem>
                          <SelectItem value="provider">Healthcare Provider</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground text-xs">
                        Choose the role that best describes your position
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}