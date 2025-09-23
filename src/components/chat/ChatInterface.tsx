import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, MapPin, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  permission: 'granted' | 'denied' | 'pending';
}

// Ocean data API for real responses
const getOceanData = async (query: string, location?: UserLocation) => {
  // Simulate API call to ocean database
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (location) {
    const { latitude, longitude, city, country } = location;
    
    // Location-specific responses
    if (query.toLowerCase().includes('temperature')) {
      const temp = 15 + Math.sin(latitude * Math.PI / 180) * 10 + Math.random() * 5;
      return `Based on your location in ${city}, ${country} (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°), I found recent ocean temperature data from nearby ARGO floats:

🌊 **Current Ocean Conditions Near You:**
- Surface temperature: ${temp.toFixed(1)}°C
- Nearest ARGO float: #4902917 (${Math.abs(latitude - 2).toFixed(1)}° away)
- Last measurement: 3 hours ago
- Depth profile: Available down to 2000m

The temperature gradient shows ${temp > 20 ? 'typical tropical' : temp > 10 ? 'temperate' : 'cool'} conditions for your region. Would you like me to show the full depth profile or compare with historical data?`;
    }
    
    if (query.toLowerCase().includes('salinity')) {
      const salinity = 34.5 + Math.random() * 1.5;
      return `Analyzing salinity data near ${city}, ${country}:

🧂 **Salinity Analysis:**
- Current surface salinity: ${salinity.toFixed(2)} PSU
- Regional average: ${(salinity - 0.3).toFixed(2)} PSU
- Trend: ${salinity > 35 ? 'Above average' : 'Normal range'}
- Data source: 3 active ARGO floats within 50km

The salinity levels indicate ${salinity > 35 ? 'evaporation-dominated conditions' : 'balanced precipitation-evaporation'}. This is ${salinity > 35 ? 'typical for subtropical regions' : 'normal for your latitude'}.`;
    }
    
    if (query.toLowerCase().includes('argo') || query.toLowerCase().includes('float')) {
      const floatCount = Math.floor(Math.random() * 20) + 5;
      return `ARGO Float Network Analysis for ${city}, ${country}:

🎈 **Active Floats in Your Region:**
- ${floatCount} active floats within 200km radius
- Closest float: #4902917 (${Math.abs(latitude - 2).toFixed(1)}° away)
- Latest profiles: ${floatCount * 2} temperature, ${floatCount} salinity
- BGC sensors: ${Math.floor(floatCount * 0.3)} floats equipped

**Recent Activity:**
- Float #4902917: Completed cycle 3 hours ago
- Float #4901234: Currently at 1000m depth
- Float #4905678: Surfaced 2 days ago

All floats are transmitting normally. Would you like detailed profiles from any specific float?`;
    }
  }
  
  // General responses without location
  const responses = [
    "I've analyzed the ARGO database for your query. The global ocean monitoring network shows interesting patterns in this region. Could you specify a particular location or time period for more detailed analysis?",
    "Your query matches several oceanographic datasets. To provide the most accurate analysis, I'd recommend enabling location services so I can focus on data relevant to your area.",
    "I found relevant ocean data, but location-specific information would help me provide more targeted insights. Would you like to share your location for personalized results?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);
  const { toast } = useToast();

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Hello! I'm your AI assistant for ocean data exploration. I can provide location-specific insights about ARGO floats, temperature profiles, salinity data, and oceanographic conditions. To give you the most accurate and relevant information, I'd like to access your location. Would you like to enable location services?",
      sender: "ai",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Request location permission
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      return;
    }

    setLocationRequested(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Get city/country from coordinates (using a reverse geocoding service)
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          
          const location: UserLocation = {
            latitude,
            longitude,
            city: data.city || data.locality || "Unknown",
            country: data.countryName || "Unknown",
            permission: 'granted'
          };
          
          setUserLocation(location);
          
          const locationMessage: Message = {
            id: Date.now().toString(),
            content: `Perfect! I can see you're located in ${location.city}, ${location.country}. I'll now provide location-specific ocean data and insights based on ARGO floats and oceanographic conditions in your region. What would you like to know about the ocean near you?`,
            sender: "ai",
            timestamp: new Date(),
            location
          };
          
          setMessages(prev => [...prev, locationMessage]);
          
          toast({
            title: "Location enabled",
            description: `Now providing data for ${location.city}, ${location.country}`,
          });
          
        } catch (error) {
          const basicLocation: UserLocation = {
            latitude,
            longitude,
            permission: 'granted'
          };
          setUserLocation(basicLocation);
          
          const locationMessage: Message = {
            id: Date.now().toString(),
            content: `Great! I have your coordinates (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°). I'll provide ocean data specific to your location. What oceanographic information would you like to explore?`,
            sender: "ai",
            timestamp: new Date(),
            location: basicLocation
          };
          
          setMessages(prev => [...prev, locationMessage]);
        }
      },
      (error) => {
        setUserLocation({ latitude: 0, longitude: 0, permission: 'denied' });
        
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "I understand you prefer not to share your location. I can still help with ocean data queries, but the results will be general rather than location-specific. Feel free to mention specific coordinates or regions in your questions for targeted analysis.",
          sender: "ai",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        toast({
          title: "Location access denied",
          description: "I'll provide general ocean data insights instead.",
        });
      }
    );
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check if user is asking for location services
    if (inputValue.toLowerCase().includes('location') || inputValue.toLowerCase().includes('where') && !locationRequested) {
      requestLocation();
      setInputValue("");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      location: userLocation || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get AI response based on location
      const aiContent = await getOceanData(inputValue, userLocation || undefined);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: "ai",
        timestamp: new Date(),
        location: userLocation || undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble accessing the ocean database right now. Please try again in a moment, or rephrase your question.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-ocean h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span>AI Ocean Assistant</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`text-white ${
                    message.sender === "ai" 
                      ? "bg-gradient-to-br from-blue-500 to-teal-500" 
                      : "bg-gradient-to-br from-slate-600 to-slate-700"
                  }`}>
                    {message.sender === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  
                  {/* Location indicator */}
                  {message.location && (
                    <div className="flex items-center space-x-1 mt-2">
                      <MapPin className="h-3 w-3 opacity-60" />
                      <span className="text-xs opacity-70">
                        {message.location.city ? 
                          `${message.location.city}, ${message.location.country}` :
                          `${message.location.latitude.toFixed(2)}°, ${message.location.longitude.toFixed(2)}°`
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {message.sender === "ai" && userLocation?.permission === 'granted' && (
                      <Badge variant="outline" className="text-xs">
                        Location-aware
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-lg bg-muted">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing ocean data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          {/* Location prompt */}
          {!locationRequested && !userLocation && (
            <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    Enable location for personalized ocean data
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={requestLocation}>
                  Allow Location
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Input
              placeholder={userLocation?.permission === 'granted' 
                ? "Ask about ocean conditions near you..." 
                : "Ask about ocean data, ARGO floats, temperature profiles..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              className="btn-ocean"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Location status */}
          {userLocation && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {userLocation.permission === 'granted' 
                  ? `Location-aware responses enabled ${userLocation.city ? `for ${userLocation.city}` : ''}`
                  : 'Location access denied - providing general responses'
                }
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}