import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Arena from "./pages/Arena";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import ChallengeWorkspace from "./pages/ChallengeWorkspace";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import AiAssistant from "./pages/AiAssistant";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Account from "./pages/Account";
import Organizations from "./pages/Organizations";
import OrganizationDetail from "./pages/OrganizationDetail";
import GroupDetail from "./pages/GroupDetail";
import TokenAction from "./pages/TokenAction";
import { RequireAuth } from "./components/platform/Platform";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/accept-invitation" element={<TokenAction />} />
              <Route path="/organizations" element={<RequireAuth><Organizations /></RequireAuth>} />
              <Route path="/organizations/:orgId" element={<RequireAuth><OrganizationDetail /></RequireAuth>} />
              <Route path="/organizations/:orgId/groups/:groupId" element={<RequireAuth><GroupDetail /></RequireAuth>} />
              <Route path="/organizations/:orgId/courses" element={<RequireAuth><Courses /></RequireAuth>} />
              <Route path="/organizations/:orgId/courses/:courseId" element={<RequireAuth><CourseDetail /></RequireAuth>} />
              <Route path="/ai" element={<RequireAuth><AiAssistant /></RequireAuth>} />
              <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/challenge/:id" element={<ChallengeDetail />} />
              <Route path="/challenge/:id/workspace" element={<ChallengeWorkspace />} />
              <Route path="/community" element={<Community />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              
              <Route path="/profile/:id" element={<RequireAuth><Account /></RequireAuth>}/>
              <Route path="/profile" element={<RequireAuth><Account /></RequireAuth>}/>

              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
