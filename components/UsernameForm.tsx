"use client";

import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  User,
} from "lucide-react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import { getBaseUrl } from "@/lib/getBaseUrl";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự")
    .max(30, "Tên người dùng phải ít hơn 30 ký tự")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Tên người dùng chỉ có thể chứa chữ cái, số, dấu gạch ngang và dấu gạch dưới",
    ),
});

const UsernameForm = () => {
  const { user } = useUser();
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const watchedUsername = form.watch("username");

  //debounce username input for availability checking
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(watchedUsername);
    }, 500); //500s delay

    return () => clearTimeout(timer); //cleanup function to clear timeout
  }, [watchedUsername]);

  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug, // ↑ import from "@convex/_generated/api"
    user?.id ? { userId: user.id } : "skip",
  );

  const availabilityCheck = useQuery(
    api.lib.usernames.checkUsernameAvailability,
    debouncedUsername.length >= 3 ? { username: debouncedUsername } : "skip",
  );

  const setUsername = useMutation(api.lib.usernames.setUsername);

  // Determine the status of the username input:
  // - Returns null if username is empty or too short
  // - Returns "checking" if username is being debounced or availability is being checked
  // - Returns "current" if username matches the user's current slug
  // - Returns "available" or "unavailable" based on availability check result
  const getStatus = () => {
    if (!debouncedUsername || debouncedUsername.length < 3) return null;
    if (debouncedUsername !== watchedUsername) return "checking";
    if (!availabilityCheck) return "checking";
    if (debouncedUsername === currentSlug) return "current";
    return availabilityCheck.available ? "available" : "unavailable";
  };

  const status = getStatus();

  const hasCustomUsername = currentSlug && currentSlug !== user?.id;

  const isSubmitDisabled =
    status !== "available" || form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) return;
    try {
      console.log("submitted form", values);
      const result = await setUsername({ username: values.username });
      if (result.success) {
        form.reset();
      } else {
        form.setError("username", { message: result.error });
      }
    } catch {
      form.setError("username", {
        message: "Failed to update username. Please try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tùy chỉnh liên kết của bạn
        </h3>
        <p className="text-gray-600 text-sm">
          Chọn tên người dùng tùy chỉnh cho trang liên kết của bạn. Đây là URL
          công khai của bạn.
        </p>
      </div>
      {/* current username status */}
      {hasCustomUsername && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Tên người dùng hiện tại
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-green-800 bg-white px-2 py-1 rounded text-sm">
                {currentSlug}
              </span>
              <Link
                href={`/u/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* URL preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Xem trước liên kết của bạn
          </span>
        </div>
        <div className="flex items-center">
          <Link
            href={`/u/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-gray-800 bg-white px-3 py-2 rounded-l border-l border-y hover:bg-gray-50 transition-colors truncate"
          >
            {getBaseUrl()}/u/{currentSlug}
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${getBaseUrl()}/u/${currentSlug}`);
              toast.success("Copied to clipboard");
            }}
            className="flex items-center justify-center w-10 h-10 bg-white border rounded-r hover:bg-gray-50 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="enter-your-desired-username"
                      {...field}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {status === "checking" && (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      )}
                      {status === "available" && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {status === "current" && (
                        <User className="w-4 h-4 text-blue-500" />
                      )}
                      {status === "unavailable" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Tên người dùng của bạn có thể chứa chữ cái, số, dấu gạch ngang
                  và dấu gạch dưới.
                </FormDescription>
                {status === "available" && (
                  <p className="text-sm text-green-600">
                    Tên người dùng có sẵn
                  </p>
                )}
                {status === "current" && (
                  <p className="text-sm text-blue-600">
                    Đây là tên người dùng hiện tại của bạn
                  </p>
                )}
                {status === "unavailable" && (
                  <p className="text-sm text-red-600">
                    {availabilityCheck?.error ||
                      "Tên người dùng đã được sử dụng"}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            disabled={isSubmitDisabled}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật tên người dùng"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UsernameForm;
