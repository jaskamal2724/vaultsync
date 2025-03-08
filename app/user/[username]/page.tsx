"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  Trash2,
  Share2,
  Search,
  LogOut,
  Star,
  Eye,
  Grid,
  List,
} from "lucide-react";
import { MovingGradientText } from "@/components/ui/moving-gradient-text";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import LoadingDots from "@/components/LoadindDots";
import { useRouter } from "next/navigation";
import {   signOut } from "firebase/auth";
import { auth } from "@/app/firebase";
import Image from "next/image";

interface CloudFile {
  $id: string;
  name: string;
  sizeOriginal: string;
  $createdAt: string;
  starred?: boolean;
  fileUrl: string; // Add this new field
}
interface DeletedFile{
  $id:string,
  fileid:string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<CloudFile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [usedStorage, setUsedStorage] = useState<number>(0);
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table"); // Toggle state
  const totalStorage = 1024;

  const getallfiles = async () => {
    try {
      // Use Promise.all to fetch both API endpoints concurrently
      const [deletedFilesResponse, filesResponse] = await Promise.all([
        axios.get("/api/trash"),
        axios.get("/api/files")
      ]);
  
      if (!filesResponse) {
        console.error("Failed to fetch files: No response received");
        return;
      }
  
      const deletedFiles = deletedFilesResponse.data.documents || [];
      const filesData = filesResponse.data.fileswithurl || [];
  
      // Use a Set for O(1) lookups instead of array filtering
      const deletedFileIds = new Set(
        deletedFiles.map((file: DeletedFile) => file.fileid)
      );
  
      // Filter files in one pass and calculate storage simultaneously
      let totalSizeMB = 0;
      const filteredFiles = filesData.filter((file: CloudFile) => {
        if (!deletedFileIds.has(file.$id)) {
          // Only calculate size for files we're keeping
          const fileSize = Number(file.sizeOriginal) || 0;
          const sizeInMB = fileSize / (1024 * 1024);
          totalSizeMB += sizeInMB;
          return true;
        }
        return false;
      });
  
      // Update state only once with the final values
      setFiles(filteredFiles);
      setUsedStorage(totalSizeMB);
    } catch (error) {
      console.error("Error fetching files:", error);
      // Consider adding error handling, such as setting an error state
    }
  };

  useEffect(() => {
   
    getallfiles();
  }, [router]);

  const handleFileUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLLabelElement>
  ) => {
    setLoading(true);
  
    let uploadedFiles: FileList | null = null;
    if ("target" in event && event.target instanceof HTMLInputElement) {
      uploadedFiles = event.target.files;
    } else if ("dataTransfer" in event) {
      uploadedFiles = event.dataTransfer.files;
    }
    if (!uploadedFiles) return;
  
    try {
      const formData = new FormData();
      Array.from(uploadedFiles).forEach((file) => {
        formData.append("file", file);
      });
      
      const response = await axios.post("/api/upload", formData);
      if (response) {
        const newFiles = response.data.uploadedFiles.map((file:CloudFile) => ({
          $id: file.$id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
          name: file.name,
          sizeOriginal: file.sizeOriginal || "0",
          $createdAt: file.$createdAt || new Date().toISOString(), // Fallback to current time
          starred: false,
          fileUrl: file.fileUrl,
        }));
        
        setFiles((prev) => [...prev, ...newFiles]);
  
        const newSizeMB = newFiles.reduce((acc: number, file: CloudFile) => {
          const sizeInMB = parseFloat(file.sizeOriginal) / (1024 * 1024);
          return acc + sizeInMB;
        }, 0);
  
        setUsedStorage((prev) => prev + newSizeMB);
        toast.success("uploaded", { autoClose: 1000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async ($id: string, name:string) => {
    // const fileToDelete = files.find((f) => f.$id === id);
    // if (!fileToDelete) return;

    // const sizeInMB = parseFloat(fileToDelete.sizeOriginal) / (1024 * 1024);
    // setFiles(files.filter((f) => f.$id !== id));
    // setUsedStorage((prev) => prev - sizeInMB);
    try {
      const res = await axios.post("/api/trash",{name,$id})
      if(res){
        // console.log(res)
        toast.success("deleted", { autoClose: 1000 });
        getallfiles()
        return
      }
      else{
        toast.error("not deleted", { autoClose: 1000 });
      }
    } catch (error) {
      console.log("error in deleting",error)
    }
    
  };

  const handleShare = (fileUrl: string) => {
    
    if (fileUrl) {
      navigator.clipboard
        .writeText(fileUrl)
        .then(() => {
          toast("Link copied to clipboard", { autoClose: 1000 });
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error("Failed to copy link", { autoClose: 1000 });
        });
    } else {
      toast.error("No shareable link available", { autoClose: 1000 });
    }
  };

  const toggleStar = (id: string) => {
    setFiles(
      files.map((f) => (f.$id === id ? { ...f, starred: !f.starred } : f))
    );
  };

  const handlePreview = (file: CloudFile) => {
    setPreviewFile(file);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "table" ? "cards" : "table");
  };

  const handledownload = (fileUrl: string, fileName: string) => {
    if (fileUrl) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName; // Set the downloaded file name
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('No download link available', { autoClose: 1000 });
    }
  };

  const hnadlelogout=async ()=>{
    try {
      await signOut(auth);
      router.replace("/signin");
      return // Redirect user after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col">
        <header className="fixed top-0 left-0 right-0 p-4 z-50 w-full border-b border-purple-500/20">
          <div className="container mx-auto flex justify-between items-center max-w-6xl px-2">
            <div className="flex items-center gap-2">
              <MovingGradientText text="CloudVault" />
            </div>
            <button onClick={()=>router.push("/trash")}>Trash</button>
            <Button
              variant="ghost"
              size="icon"
              onClick={hnadlelogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-grow w-full px-4 pt-28 sm:pt-32 md:pt-36 pb-8 max-w-6xl mx-auto">
          <Card className="bg-purple-900/20 border-purple-500/20 mb-6">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-white">
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={(usedStorage / totalStorage) * 100}
                className="w-full h-2 mb-2"
              />
              <p className="text-xs sm:text-sm text-gray-300">
                {usedStorage.toFixed(1)} MB of {totalStorage} MB used
              </p>
            </CardContent>
          </Card>

          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-purple-500/50 rounded-lg cursor-pointer hover:border-purple-500/80 transition-all"
              onDrop={handleFileUpload}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 mb-2" />
              <p className="text-sm sm:text-base text-gray-300">
                Drag & drop files or{" "}
                <span className="text-purple-400 underline">
                  click to upload
                </span>
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div>
            {loading ? <LoadingDots /> : ""}
            {/* <LoadingDots/> */}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-purple-900/20 border-purple-500/20 text-white placeholder-gray-500"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleViewMode}
              className="ml-4 hover:bg-purple-700/50"
            >
              {viewMode === "table" ? (
                <Grid className="h-5 w-5" />
              ) : (
                <List className="h-5 w-5" />
              )}
            </Button>
          </div>

          <Card className="bg-purple-900/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-white">
                Your Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {files.length > 0 ? (
                viewMode === "table" ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/20">
                        <TableHead className="text-white ">Name</TableHead>
                        <TableHead className="text-white hidden sm:table-cell">
                          Size (MB)
                        </TableHead>
                        <TableHead className="text-white hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="text-white">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => (
                        <TableRow
                          key={file.$id}
                          className="border-purple-500/20 hover:bg-purple-700/10"
                        >
                          <TableCell className="text-sm sm:text-base text-white">
                            {file.name}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-white">
                            {(
                              parseFloat(file.sizeOriginal) /
                              (1024 * 1024)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell text-white">
                            {new Date(file.$createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                          <TableCell className="flex gap-2 text-white">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreview(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={()=>handledownload(file.fileUrl, file.name)
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShare(file.fileUrl)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleStar(file.$id)}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  file.starred
                                    ? "text-yellow-400 fill-yellow-400"
                                    : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(file.$id, file.name)}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <Card
                        key={file.$id}
                        className="bg-purple-900/30 border-purple-500/30 hover:border-purple-500/50 transition-all"
                      >
                        <CardContent className="p-4">
                          <h3 className="text-white text-sm sm:text-base font-semibold truncate">
                            {file.name}
                          </h3>
                          <p className="text-xs text-white">
                            Size:{" "}
                            {(
                              parseFloat(file.sizeOriginal) /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB
                          </p>
                          <p className="text-xs text-white">
                            Date:{" "}
                            {new Date(file.$createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </p>
                          <div className="flex gap-2 mt-2  text-white">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreview(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handledownload(file.fileUrl, file.name)
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleShare(file.fileUrl)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleStar(file.$id)}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  file.starred
                                    ? "text-yellow-400 fill-yellow-400"
                                    : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(file.$id, file.name)}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-center text-gray-400 text-sm sm:text-base">
                  No files uploaded yet.
                </p>
              )}
            </CardContent>
          </Card>

          {previewFile && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="bg-purple-900/20 border-purple-500/20 w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-white">Preview: {previewFile.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Preview of {previewFile.name} (mock content)
                  </p>
                  <Image src={previewFile.fileUrl} alt="No preview for files" className=" text-white text-center w-36 h-60"/>
                  <Button onClick={() => setPreviewFile(null)} className=" text-purple-900 bg-purple-300 mt-2">
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <footer className="w-full text-center text-xs text-gray-400 p-4 border-t border-purple-500/20">
          <p>© 2025 CloudVault. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
