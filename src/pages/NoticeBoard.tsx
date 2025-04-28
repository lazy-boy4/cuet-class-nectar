import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { fetchNotices } from "@/api/admin";
import { Notice } from "@/types";

const NoticeBoard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    document.title = "Notice Board - CUET Class Management System";

    // Check if user is authenticated
    const userRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

    if (!userRole) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Fetch notices using react-query
  const { data: fetchedNotices, isLoading, isError } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
  });

  useEffect(() => {
    if (fetchedNotices) {
      setNotices(fetchedNotices);
    }
  }, [fetchedNotices]);

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy - hh:mm a");
  };

  // Filter notices based on search term
  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render each notice
  const renderNotice = (notice: Notice) => {
    return (
      <Card key={notice.id} className="mb-4 border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              {notice.title}
            </CardTitle>
            <div className="text-sm text-white/70">
              {formatDate(notice.createdAt)}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/60">
            {notice.isGlobal ? (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                Global
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-500/10 text-green-400">
                {notice.className || "Class Notice"} {/* Updated to handle missing className */}
              </Badge>
            )}
            <span>by</span>
            <span className="font-medium text-white/80">
              {notice.authorName || notice.creatorName || "Admin"} {/* Updated to handle missing creatorName */}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-white/90">{notice.content}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout
      title="Notice Board"
      description="Stay informed with the latest announcements and updates"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search notices..."
            className="w-full bg-white/5 border-white/10 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Notices List */}
        {isLoading ? (
          <div className="text-center text-white/70">Loading notices...</div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Error loading notices. Please try again.
          </div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => renderNotice(notice))
        ) : (
          <div className="text-center text-white/70">No notices found.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NoticeBoard;
