import { Request, Response } from "express";
import Suggestion from "../models/suggestion";

interface SuggestionData {
  suggestion: string;
  category: string;
  employeeId?: string;
}

const validateSuggestion = (suggestionData: SuggestionData): boolean => {
  const { suggestion, category } = suggestionData;
  return !!suggestion && !!category;
};

const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const generateHash = async (): Promise<string> => {
  const latestSuggestion = await Suggestion.findOne().sort({ createdAt: -1 }).exec();
  const latestHash = latestSuggestion?.hash;

  if (latestHash) {
    const hashNumber = parseInt(latestHash.slice(1)) + 1;
    return `A${hashNumber.toString().padStart(3, '0')}`;
  } else {
    return 'A001';
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await Suggestion.find();
    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
};

export const createSuggestion = async (req: Request, res: Response) => {
  const { suggestion, employeeId, category } = req.body as SuggestionData;

  if (!validateSuggestion(req.body)) {
    return res.status(400).json({ message: "Suggestion and Category are required." });
  }

  try {
    const currentDate = new Date();
    const formattedDate = formatDateTime(currentDate); 

    const hash = await generateHash(); 

    const newSuggestion = new Suggestion({
      hash,  
      category,
      suggestion,
      dateTime: formattedDate,  
      employeeId: employeeId || "Anonymous",  
    });

    const savedSuggestion = await newSuggestion.save();
    res.status(201).json(savedSuggestion);
  } catch (err) {
    res.status(500).json({ message: "Failed to save suggestion", error: (err as Error).message });
  }
};

export const deleteSuggestion = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the suggestion hash from the URL params

  try {
    // Find the suggestion by hash and delete it
    const deletedSuggestion = await Suggestion.findOneAndDelete({ _id : id });

    if (!deletedSuggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    // Return success message
    res.status(200).json({ message: "Suggestion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete suggestion", error: (err as Error).message });
  }
};

export const markSuggestion = async (req: Request, res: Response) => {
  const { id, status } = req.params;

  // Validate status
  if (!['read', 'unread'].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be 'read' or 'unread'." });
  }

  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }

    res.status(200).json(suggestion);
  } catch (error) {
    console.error('Error updating suggestion status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};