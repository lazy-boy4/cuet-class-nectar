import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Users, Crown, Trash2, Search, UserMinus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ClassroomMember } from "@/types";
import { removeMemberFromClassroom } from "@/api/classroom";

interface MemberManagementProps {
  classroomId: string;
  members: ClassroomMember[];
  isCR: boolean;
  isLoading: boolean;
  crId: string;
  onRefetch: () => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({
  classroomId,
  members,
  isCR,
  isLoading,
  crId,
  onRefetch
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Remove member mutation
  const removeMutation = useMutation({
    mutationFn: (memberId: string) => removeMemberFromClassroom(classroomId, memberId),
    onSuccess: () => {
      toast({ title: "Member Removed", description: "Member has been removed from the classroom" });
      onRefetch();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
    },
  });

  // Filter members by search
  const filteredMembers = members.filter(
    (member) =>
      member.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.studentIdNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border-white/10 bg-white/5 animate-pulse">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      {/* Member Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">
          {filteredMembers.length} of {members.length} members
        </p>
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Users className="mb-4 h-12 w-12 text-white/30" />
            <h3 className="text-lg font-semibold text-white mb-2">No Members Yet</h3>
            <p className="text-white/70 text-center">
              Share the classroom code to invite students
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Search Results */}
      {members.length > 0 && filteredMembers.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Search className="mb-4 h-8 w-8 text-white/30" />
            <p className="text-white/70">No members found matching "{searchQuery}"</p>
          </CardContent>
        </Card>
      )}

      {/* Member List */}
      <div className="space-y-2">
        {filteredMembers.map((member) => {
          const isMemberCR = member.studentId === crId;

          return (
            <Card key={member.id} className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarFallback className="bg-cuet-blue/20 text-cuet-blue text-sm">
                        {getInitials(member.studentName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{member.studentName}</h4>
                        {isMemberCR && (
                          <Badge className="bg-cuet-gold/20 text-cuet-gold border-cuet-gold/30 text-xs">
                            <Crown className="mr-1 h-3 w-3" />
                            CR
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60">{member.studentEmail}</p>
                      {member.studentIdNumber && (
                        <p className="text-xs text-white/40">ID: {member.studentIdNumber}</p>
                      )}
                    </div>
                  </div>

                  {isCR && !isMemberCR && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-cuet-navy border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Remove Member</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/70">
                            Are you sure you want to remove {member.studentName} from this classroom?
                            They will need to rejoin using the classroom code.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeMutation.mutate(member.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MemberManagement;
