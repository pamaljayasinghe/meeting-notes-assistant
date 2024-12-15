// /components/MeetingAssistant.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mic,
  StopCircle,
  FileText,
  Clock,
  CheckCircle,
  Calendar,
  Plus,
  Tag,
  Edit2,
  Trash2,
} from "lucide-react";

interface Note {
  id: number;
  title: string;
  date: string;
  duration: string;
  importance: string;
  summary: string;
  actionItems: string[];
  keyDecisions: string[];
}

const MeetingAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Product Team Sync",
      date: "Dec 15, 2024",
      duration: "45 min",
      summary: "Discussed Q1 roadmap and feature prioritization.",
      importance: "high",
      actionItems: [
        "Review competitor analysis by Friday",
        "Schedule user interviews",
        "Update project timeline",
      ],
      keyDecisions: [
        "Moving forward with mobile app redesign",
        "Postponing API migration to Q2",
      ],
    },
    {
      id: 2,
      title: "Marketing Strategy",
      date: "Dec 14, 2024",
      duration: "30 min",
      importance: "medium",
      summary: "Planned social media campaign for product launch.",
      actionItems: [
        "Create content calendar",
        "Design social media assets",
        "Brief influencer partners",
      ],
      keyDecisions: [
        "Launch date set for January 15th",
        "Budget approved for paid promotion",
      ],
    },
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    summary: "",
    importance: "medium",
    actionItems: "",
    keyDecisions: "",
  });

  const importanceColors = {
    low: "bg-gray-50 hover:bg-gray-100",
    medium: "bg-blue-50 hover:bg-blue-100",
    high: "bg-red-50 hover:bg-red-100",
    urgent: "bg-purple-50 hover:bg-purple-100",
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleNewNoteSubmit = () => {
    const actionItemsArray = newNote.actionItems
      .split("\n")
      .filter((item) => item.trim());
    const keyDecisionsArray = newNote.keyDecisions
      .split("\n")
      .filter((item) => item.trim());

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const newNoteObject: Note = {
      id: notes.length + 1,
      title: newNote.title,
      date: currentDate,
      duration: "0 min",
      importance: newNote.importance,
      summary: newNote.summary,
      actionItems: actionItemsArray,
      keyDecisions: keyDecisionsArray,
    };

    setNotes([newNoteObject, ...notes]);
    setNewNote({
      title: "",
      summary: "",
      importance: "medium",
      actionItems: "",
      keyDecisions: "",
    });
  };

  const startEditing = (note: Note) => {
    setEditingNote({
      ...note,
      actionItems: note.actionItems.join("\n"),
      keyDecisions: note.keyDecisions.join("\n"),
    });
    setIsEditMode(true);
  };

  const handleEditSubmit = () => {
    const actionItemsArray = editingNote.actionItems
      .split("\n")
      .filter((item) => item.trim());
    const keyDecisionsArray = editingNote.keyDecisions
      .split("\n")
      .filter((item) => item.trim());

    const updatedNote: Note = {
      ...editingNote,
      actionItems: actionItemsArray,
      keyDecisions: keyDecisionsArray,
    };

    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );

    setActiveNote(updatedNote);
    setEditingNote(null);
    setIsEditMode(false);
  };

  const handleDeleteNote = (noteId: number) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== noteId));
      if (activeNote?.id === noteId) {
        setActiveNote(null);
      }
    }
  };

  return (
    <div className="flex h-screen max-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white p-4">
        <div className="space-y-2 mb-6">
          <Button
            className={`w-full ${
              isRecording ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            onClick={handleRecordToggle}
          >
            {isRecording ? (
              <>
                <StopCircle className="mr-2 h-4 w-4" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </>
            )}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Meeting Title"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                />
                <Select
                  value={newNote.importance}
                  onValueChange={(value) =>
                    setNewNote({ ...newNote, importance: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Importance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Meeting Summary"
                  value={newNote.summary}
                  onChange={(e) =>
                    setNewNote({ ...newNote, summary: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Action Items (one per line)"
                  value={newNote.actionItems}
                  onChange={(e) =>
                    setNewNote({ ...newNote, actionItems: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Key Decisions (one per line)"
                  value={newNote.keyDecisions}
                  onChange={(e) =>
                    setNewNote({ ...newNote, keyDecisions: e.target.value })
                  }
                />
                <Button onClick={handleNewNoteSubmit}>Create Note</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="font-medium text-sm text-gray-500 mb-2">
          Recent Meetings
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`mb-2 cursor-pointer ${
                importanceColors[note.importance]
              } ${activeNote?.id === note.id ? "border-blue-500" : ""}`}
              onClick={() => setActiveNote(note)}
            >
              <CardContent className="p-3">
                <div className="font-medium">{note.title}</div>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {note.date}
                </div>
                <div className="flex items-center mt-1">
                  <Tag className="h-3 w-3 mr-1" />
                  <span className="text-xs capitalize">
                    {note.importance} Priority
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeNote ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{activeNote.title}</h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${
                      activeNote.importance === "high"
                        ? "bg-red-100 text-red-800"
                        : activeNote.importance === "medium"
                        ? "bg-blue-100 text-blue-800"
                        : activeNote.importance === "urgent"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activeNote.importance} Priority
                  </span>
                  <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEditing(activeNote)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Meeting Title"
                          value={editingNote?.title || ""}
                          onChange={(e) =>
                            setEditingNote({
                              ...editingNote,
                              title: e.target.value,
                            })
                          }
                        />
                        <Select
                          value={editingNote?.importance}
                          onValueChange={(value) =>
                            setEditingNote({
                              ...editingNote,
                              importance: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Importance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">
                              Medium Priority
                            </SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea
                          placeholder="Meeting Summary"
                          value={editingNote?.summary || ""}
                          onChange={(e) =>
                            setEditingNote({
                              ...editingNote,
                              summary: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Action Items (one per line)"
                          value={editingNote?.actionItems || ""}
                          onChange={(e) =>
                            setEditingNote({
                              ...editingNote,
                              actionItems: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Key Decisions (one per line)"
                          value={editingNote?.keyDecisions || ""}
                          onChange={(e) =>
                            setEditingNote({
                              ...editingNote,
                              keyDecisions: e.target.value,
                            })
                          }
                        />
                        <div className="flex justify-between">
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteNote(activeNote.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Note
                          </Button>
                          <Button onClick={handleEditSubmit}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex items-center text-gray-500 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">{activeNote.duration}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>{activeNote.date}</span>
              </div>
            </div>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="action-items">Action Items</TabsTrigger>
                <TabsTrigger value="decisions">Key Decisions</TabsTrigger>
                <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{activeNote.summary}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="action-items">
                <Card>
                  <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {activeNote.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decisions">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Decisions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {activeNote.keyDecisions.map((decision, index) => (
                        <li key={index} className="flex items-start">
                          <FileText className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                          <span>{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transcript">
                <Card>
                  <CardHeader>
                    <CardTitle>Full Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      {isRecording
                        ? "Recording in progress... Transcript will appear here."
                        : "Start recording to see the transcript."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a meeting or start recording to view notes
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingAssistant;
