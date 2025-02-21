"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, Trash2, Share2, Search, LogOut, Star, Eye, Edit } from "lucide-react"
import { MovingGradientText } from "@/components/ui/moving-gradient-text"
import { useToast } from "@/hooks/use-toast"


interface CloudFile {
  id: number
  name: string
  size: number
  date: string
  starred?: boolean
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [files, setFiles] = useState<CloudFile[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [usedStorage, setUsedStorage] = useState<number>(0)
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null)
  const totalStorage = 1024

  useEffect(() => {
    const mockFiles: CloudFile[] = [
      { id: 1, name: "Project.pdf", size: 250, date: "2025-02-20", starred: false },
      { id: 2, name: "Photo.jpg", size: 1.8, date: "2025-02-19", starred: false },
    ]
    setFiles(mockFiles)
    setUsedStorage(mockFiles.reduce((acc, file) => acc + file.size, 0))
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLLabelElement>) => {
    let uploadedFiles: FileList | null = null
    if ("target" in event && event.target instanceof HTMLInputElement) {
      uploadedFiles = event.target.files
    } else if ("dataTransfer" in event) {
      uploadedFiles = event.dataTransfer.files
    }
    if (!uploadedFiles) return

    const newFiles: CloudFile[] = Array.from(uploadedFiles).map((file: File, index: number) => ({
      id: files.length + index + 1,
      name: file.name,
      size: parseFloat((file.size / 1024 / 1024).toFixed(1)),
      date: new Date().toISOString().split("T")[0],
      starred: false,
    }))

    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0) + usedStorage
    if (totalSize > totalStorage) {
      toast({ title: "Storage Full", description: "Upgrade your plan for more space!", variant: "destructive" })
      return
    }
    setFiles([...files, ...newFiles])
    setUsedStorage(totalSize)
    toast({ title: "Success", description: `${newFiles.length} file(s) uploaded!` })
  }

  const handleDelete = (id: number) => {
    const fileToDelete = files.find((f) => f.id === id)
    if (!fileToDelete) return
    setFiles(files.filter((f) => f.id !== id))
    setUsedStorage(usedStorage - fileToDelete.size)
    toast({ title: "Deleted", description: `${fileToDelete.name} removed.` })
  }

  const handleShare = (file: CloudFile) => {
    const shareLink = `https://cloudvault.com/share/${file.id}`
    toast({
      title: "Share Link Generated",
      description: <p>Link: {shareLink} (View Only)</p>,
    })
  }

  const toggleStar = (id: number) => {
    setFiles(files.map(f => f.id === id ? { ...f, starred: !f.starred } : f))
  }

  const handlePreview = (file: CloudFile) => {
    setPreviewFile(file)
  }

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 p-4 z-50 w-full border-b border-purple-500/20">
        <div className="container mx-auto flex justify-between items-center max-w-6xl px-2">
          <div className="flex items-center gap-2">
            
            <MovingGradientText text="CloudVault"  />
          </div>
          <Button variant="ghost" size="icon" onClick={() => console.log("Logout")}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow w-full px-4 pt-28 sm:pt-32 md:pt-36 pb-8 max-w-6xl mx-auto">
        <Card className="bg-purple-900/20 border-purple-500/20 mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(usedStorage / totalStorage) * 100} className="w-full h-2 mb-2" />
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
              Drag & drop files or <span className="text-purple-400 underline">click to upload</span>
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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-purple-900/20 border-purple-500/20 text-white placeholder-gray-500"
          />
        </div>

        <Card className="bg-purple-900/20 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white text-center">Your Files</CardTitle>
          </CardHeader>

          <CardContent className="mx-[20px]">
            {filteredFiles.length > 0 ? (
              <Table>
                
                <TableHeader>
                  <TableRow className="border-purple-500/20">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white hidden sm:table-cell">Size (MB)</TableHead>
                    <TableHead className="text-white hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredFiles.map((file) => (
                    <TableRow key={file.id} className="border-purple-500/20 hover:bg-purple-700/10">
                      <TableCell className="text-sm sm:text-base text-white">{file.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-white">{file.size}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell text-white">{file.date}</TableCell>
                      <TableCell className="flex gap-2 text-white">
                        <Button variant="ghost" size="icon" onClick={() => handlePreview(file)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => console.log(`Download ${file.name}`)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleShare(file)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleStar(file.id)}>
                          <Star className={`h-4 w-4 ${file.starred ? "text-yellow-400 fill-yellow-400" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                
              </Table>
            ) : (
              <p className="text-center text-gray-400 text-sm sm:text-base">No files uploaded yet.</p>
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
                <p className="text-gray-300">Preview of {previewFile.name} (mock content)</p>
                <Button onClick={() => setPreviewFile(null)} className="mt-2 bg-blue-500">Close</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="w-full text-center text-xs text-gray-400 p-4 border-t border-purple-500/20">
        <p>© 2025 CloudVault. All rights reserved.</p>
      </footer>
    </div>
  )
}