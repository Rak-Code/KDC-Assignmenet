import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createInstructor } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Instructor, CreateInstructorDto } from "@/lib/types";

// Define form validation schema
const instructorFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  expertise: z.string().min(3, { message: "Expertise is required" }),
  imageUrl: z.string().url({ message: "Please enter a valid URL" }),
});

interface InstructorFormValues {
  name: string;
  email: string;
  expertise: string;
  imageUrl: string;
}

interface InstructorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstructorAdded?: (instructor: Instructor) => void;
}

export default function InstructorForm({ open, onOpenChange, onInstructorAdded }: InstructorFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Define form
  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      expertise: "",
      imageUrl: "",
    },
  });

  async function onSubmit(data: InstructorFormValues) {
    setIsLoading(true);
    try {
      const instructorData: CreateInstructorDto = {
        ...data,
        role: "instructor",
        password: Math.random().toString(36).slice(-8),
      };

      const newInstructor = await createInstructor(instructorData);

      toast({
        title: "Success",
        description: "Instructor added successfully",
      });

      onOpenChange(false);
      form.reset();
      onInstructorAdded?.(newInstructor);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add instructor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Instructor</DialogTitle>
          <DialogDescription>
            Enter the details of the new instructor. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expertise</FormLabel>
                  <FormControl>
                    <Input placeholder="React, JavaScript, Node.js" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a URL for the instructor's profile image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Save Instructor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
