"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
    title: z
        .string()
        .min(1, "Tiêu đề là bắt buộc")
        .max(100, "Tiêu đề phải ít hơn 100 ký tự"),
    url: z.string().url("Vui lòng nhập một URL hợp lệ"),
});

/**
 * Renders a form for creating a new link, handling validation, submission, and navigation on success.
 *
 * The form validates title and URL using the defined Zod schema, displays per-field validation messages,
 * submits data via the Convex `createLink` mutation inside a transition, and navigates to "/dashboard"
 * when submission succeeds. Submission errors are shown as a user-facing message.
 *
 * @returns The JSX element for the create-link form UI.
 */
function CreateLinkForm() {
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);

    const [isSubmitting, startTransition] = useTransition();

    const createLink = useMutation(api.lib.links.createLink);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            url: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);

        // Check if url has https or http if not add it
        // if (!values.url.startsWith("https://") && !values.url.startsWith("http://")) {
        //     values.url = `https://${values.url}`;
        // }

        startTransition(async () => {
            try {
                await createLink({
                    title: values.title,
                    url: values.url
                });

                router.push("/dashboard");
            } catch (err) {
                setError(err instanceof Error ? err.message : "Không tạo được liên kết");
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tiêu đề liên kết</FormLabel>
                            <FormControl>
                                <Input placeholder="My awesome link" {...field} />
                            </FormControl>
                            <FormDescription>
                                Điều này sẽ được hiển thị dưới dạng văn bản nút cho liên kết của bạn.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                URL đích nơi người dùng sẽ được chuyển hướng.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-full">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Đang tạo..." : "Tạo liên kết"}
                </Button>
            </form>
        </Form>
    )
}

export default CreateLinkForm;