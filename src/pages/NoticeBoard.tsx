
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Search, FilterX } from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchNotices } from "@/api";
import { Notice } from "@/types";

const NoticeBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    document.title = "Notice Board - CUET Class Management System";
  }, []);
  
  // Fetch notices
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => fetchNotices(),
  });
  
  // Filter notices based on search term and active tab
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "global") return notice.isGlobal && matchesSearch;
    if (activeTab === "class") return !notice.isGlobal && matchesSearch;
    
    return matchesSearch;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <DashboardLayout
      title="Notice Board"
      description="View important announcements and updates"
    >
      {/* Search and filter */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative flex w-full max-w-sm items-center">
          <Search className="absolute left-3 h-5 w-5 text-white/50" />
          <Input
            type="search"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 text-white/70"
              onClick={handleClearSearch}
            >
              <FilterX className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="class">Class-specific</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Notices */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-white/70">Loading notices...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 py-12">
            <Bell className="mb-4 h-12 w-12 text-white/30" />
            <h3 className="text-xl font-medium text-white">No notices found</h3>
            <p className="text-white/70">
              {searchTerm
                ? "No notices match your search criteria"
                : "There are no notices to display at this time"}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <Card 
              key={notice.id} 
              className={`reveal border-white/10 transition-all duration-300 hover:bg-white/[0.03] ${
                notice.isGlobal 
                  ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20" 
                  : "bg-white/5"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{notice.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {notice.isGlobal ? (
                        <span className="inline-flex items-center rounded-full bg-blue-700/30 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                          Global Announcement
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-purple-700/30 px-2.5 py-0.5 text-xs font-medium text-purple-400">
                          {notice.className}
                        </span>
                      )}
                      <span className="ml-2 text-white/50">
                        Posted by {notice.creatorName} • {formatDate(notice.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 whitespace-pre-line">{notice.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default NoticeBoard;
