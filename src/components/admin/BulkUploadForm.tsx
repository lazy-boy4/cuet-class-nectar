
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BulkUploadFormProps {
  onUpload: (data: any[]) => void;
  loading: boolean;
}

const BulkUploadForm = ({ onUpload, loading }: BulkUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({ success: 0, failed: 0, errors: [] });

  const sampleCSV = `CUET ID,Full Name,Email,Department,Session,Section
2309026,John Doe,u2309026@student.cuet.ac.bd,CSE,2023-24,A
2309027,Jane Smith,u2309027@student.cuet.ac.bd,EEE,2023-24,B
2309028,Bob Johnson,u2309028@student.cuet.ac.bd,CSE,2023-24,A`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setUploadStatus("idle");
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }
    
    return data;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("processing");
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation and processing
      const errors: string[] = [];
      let successCount = 0;
      
      data.forEach((row, index) => {
        if (!row['CUET ID'] || !row['Full Name'] || !row['Email']) {
          errors.push(`Row ${index + 2}: Missing required fields`);
        } else {
          successCount++;
        }
      });
      
      setUploadResults({
        success: successCount,
        failed: errors.length,
        errors: errors.slice(0, 5), // Show only first 5 errors
      });
      
      if (errors.length === 0) {
        setUploadStatus("success");
        onUpload(data);
        toast({
          title: "Upload Successful",
          description: `Successfully uploaded ${successCount} students.`,
        });
      } else {
        setUploadStatus("error");
        toast({
          title: "Upload Completed with Errors",
          description: `${successCount} students uploaded, ${errors.length} failed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description: "Error processing the CSV file.",
        variant: "destructive",
      });
    }
  };

  const downloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Sample CSV Download */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText size={20} />
            CSV Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 mb-4">
            Download the sample CSV file to see the required format for bulk student upload.
          </p>
          <Button onClick={downloadSample} variant="outline" className="gap-2">
            <Download size={16} />
            Download Sample CSV
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload size={20} />
            Upload Students
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile" className="text-white">
              Select CSV File
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {file && (
            <div className="p-4 border border-white/10 rounded-lg">
              <p className="text-white/90">
                <strong>Selected:</strong> {file.name}
              </p>
              <p className="text-white/70 text-sm">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || loading || uploadStatus === "processing"}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {uploadStatus === "processing" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Students
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Upload Results */}
      {uploadStatus !== "idle" && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {uploadStatus === "success" ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <AlertCircle size={20} className="text-yellow-400" />
              )}
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-white">
                <span>Successful:</span>
                <span className="text-green-400">{uploadResults.success}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Failed:</span>
                <span className="text-red-400">{uploadResults.failed}</span>
              </div>
            </div>

            {uploadResults.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Errors:</h4>
                <ul className="text-red-400 text-sm space-y-1">
                  {uploadResults.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
                {uploadResults.failed > uploadResults.errors.length && (
                  <p className="text-white/70 text-sm mt-2">
                    And {uploadResults.failed - uploadResults.errors.length} more errors...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkUploadForm;
