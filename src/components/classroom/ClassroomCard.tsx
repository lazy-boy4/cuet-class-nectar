import React from "react";
import { BookOpen, Users, Crown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Classroom } from "@/types";

interface ClassroomCardProps {
  classroom: Classroom;
  isCR: boolean;
  onClick: () => void;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom, isCR, onClick }) => {
  return (
    <Card
      className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cuet-blue/20">
              <BookOpen className="h-5 w-5 text-cuet-blue" />
            </div>
            <div>
              <CardTitle className="text-lg text-white group-hover:text-cuet-blue transition-colors">
                {classroom.name}
              </CardTitle>
              <CardDescription className="text-white/60">
                {classroom.departmentName || classroom.departmentCode}
              </CardDescription>
            </div>
          </div>
          {isCR && (
            <Badge className="bg-cuet-gold/20 text-cuet-gold border-cuet-gold/30">
              <Crown className="mr-1 h-3 w-3" />
              CR
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Section {classroom.section}
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            {classroom.session}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {classroom.memberCount || 0} members
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {classroom.courseCount || 0} courses
            </span>
          </div>
          <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-cuet-blue group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassroomCard;
