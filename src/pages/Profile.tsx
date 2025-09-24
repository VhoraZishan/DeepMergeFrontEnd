import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  MapPin, 
  Calendar, 
  Award,
  Database,
  Activity,
  Camera,
  Edit3
} from "lucide-react";
import { BackendStatus } from "@/components/system/BackendStatus";

const Profile = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "Dr. Ocean Researcher",
    email: "ocean.researcher@cmlre.org",
    title: "Senior Marine Scientist",
    institution: "Marine Research Institute",
    location: "Woods Hole, Massachusetts",
    bio: "Specializing in ocean temperature analysis and ARGO float data interpretation with over 15 years of experience in oceanographic research.",
    expertise: ["Ocean Temperature Analysis", "ARGO Float Data", "Climate Modeling", "Data Visualization"],
    joinDate: "March 2019",
    lastActive: "2 hours ago"
  });

  const stats = [
    { label: "Queries Processed", value: "2,847", icon: Database },
    { label: "Data Points Analyzed", value: "1.2M", icon: Activity },
    { label: "Visualizations Created", value: "156", icon: Award },
    { label: "Active Days", value: "342", icon: Calendar },
  ];

  const recentActivity = [
    {
      action: "Generated temperature profile visualization",
      location: "Indian Ocean (15°S, 75°E)",
      time: "2 hours ago"
    },
    {
      action: "Analyzed salinity data trends",
      location: "Arabian Sea region",
      time: "1 day ago"
    },
    {
      action: "Created comparative analysis report",
      location: "Bay of Bengal vs Arabian Sea",
      time: "3 days ago"
    }
  ];

  const handleSave = () => {
    localStorage.setItem('cmlre-profile', JSON.stringify(profile));
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-surface ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="animate-fade-in">
              <Breadcrumb />
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
                <p className="text-muted-foreground">
                  Manage your professional profile and view your activity
                </p>
                <div className="mt-2">
                  <BackendStatus />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <Card className="card-ocean lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src="/avatars/researcher.jpg" alt={profile.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-2xl">
                            {profile.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.title}</p>
                        <div className="flex items-center justify-center space-x-1 mt-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="title">Professional Title</Label>
                          <Input
                            id="title"
                            value={profile.title}
                            onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="institution">Institution</Label>
                          <Input
                            id="institution"
                            value={profile.institution}
                            onChange={(e) => setProfile(prev => ({ ...prev, institution: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biography</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Areas of Expertise</Label>
                        <div className="flex flex-wrap gap-2">
                          {profile.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm" className="text-xs h-6">
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleSave} className="btn-ocean">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="card-ocean">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Activity Stats</span>
                  </CardTitle>
                  <CardDescription>
                    Your platform usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <stat.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{stat.label}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-ocean lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Your latest interactions with ocean data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Database className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.location}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="card-ocean lg:col-span-3">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Member Since</Label>
                      <p className="text-sm text-muted-foreground">{profile.joinDate}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Last Active</Label>
                      <p className="text-sm text-muted-foreground">{profile.lastActive}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account Type</Label>
                      <Badge variant="outline" className="w-fit">Research Professional</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;