
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface NoticeFormProps {
  classId: string;
  onNoticeCreated?: () => void;
}

const NoticeForm = ({ classId, onNoticeCreated }: NoticeFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Notice Posted",
        description: "Your notice has been posted successfully.",
      });
      
      setTitle("");
      setContent("");
      onNoticeCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post notice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">Post New Notice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter notice content"
              className="bg-white/5 border-white/10 text-white min-h-[120px]"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setTitle("");
                setContent("");
              }}
            >
              Clear
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Posting..." : "Post Notice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NoticeForm;
