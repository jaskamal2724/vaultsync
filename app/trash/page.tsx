"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Define interface for trash items
interface TrashItem {
  name: string;
  fileid: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId?: string;
  $collectionId?: string;
}

const TrashPage = () => {
  
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);

  const fetchTrashItems = async () => {
    try {
      const response = await (await axios.get("/api/trash")).data.documents;
      console.log(response);
      setTrashItems(response);
    } catch (error) {
      console.error("Error fetching trash items:", error);
    }
  };

  useEffect(() => {
    fetchTrashItems();
  }, []);

  const handleDelete = async (fileId: string) => {
    try {
      // console.log(fileId)
      const res = await axios.delete("/api/delete",{data:{fileId}});
      if (res) {
        console.log("deleted permanently");
      }
      toast.success("permanently deleted", { autoClose: 1000 });

      fetchTrashItems();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handlepermant=async(fileid:string)=>{
    try {
      await axios.delete("/api/pmd",{data:{fileid}})
    } catch (error) {
      console.log(error)
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
      <div className="p-6 bg-purple-800 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-purple-200">Trash</h1>
        <Card className="shadow-lg w-full max-w-3xl mx-auto bg-purple-700 border-purple-600">
          <CardContent className="p-6 flex flex-col gap-4">
            {trashItems.length === 0 ? (
              <p className="text-lg text-purple-300">No deleted items found.</p>
            ) : (
              trashItems.map((item) => (
                <div
                  key={item.$id}
                  className="flex justify-between items-center bg-purple-600 p-3 rounded-lg"
                >
                  <span className="text-white">{item.name}</span>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white"
                    onClick={() => [handleDelete(item.$id),handlepermant(item.fileid)]}
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TrashPage;
