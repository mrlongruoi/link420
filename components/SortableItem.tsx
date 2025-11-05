"use client";

import { useState, useTransition } from "react";
import { BarChart3, Check, GripVertical, Pencil, Trash2, X } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function SortableItem({ id, link }: { id: Id<"links">, link: Doc<"links"> }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const [isEditing, setIsEditing] = useState(false);

    const [editTitle, setEditTitle] = useState(link?.title);

    const [editUrl, setEditUrl] = useState(link?.url);

    const [isUpdating, startTransition] = useTransition();

    const deleteLink = useMutation(api.lib.links.deleteLink);

    const updateLink = useMutation(api.lib.links.updateLink);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleCancel = () => {
        setEditTitle(link.title);
        setEditUrl(link.url);
        setIsEditing(false);
    }

    const handleSave = async () => {
        if (!editTitle?.trim() || !editUrl?.trim()) return;

        startTransition(async () => {
            try {
                // Add https:// if no protocol is specified
                let processedUrl = editUrl;

                if (!processedUrl.startsWith("https://") && !processedUrl.startsWith("http://")) {
                    processedUrl = `https://${processedUrl}`;
                }

                await updateLink({
                    linkId: id,
                    title: editTitle.trim(),
                    url: processedUrl,
                });

                setIsEditing(false);
            } catch (error) {
                console.error("Không thể cập nhật liên kết:", error);
            }
        })
    }

    if (!link) return null;

    return (
        <div ref={setNodeRef} style={style} className="p-4 border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            {isEditing ? (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Tiêu đề liên kết"
                            className="font-semibold"
                        />

                        <Input
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="text-sm"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isUpdating}
                        >
                            <X className="w-4 h-4" />
                        </Button>

                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isUpdating || !editTitle || !editUrl.trim()}
                        >
                            {isUpdating ? (
                                <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">

                    {/* drag handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        aria-describedby={`link-${id}`}
                        className="cursor-move p-1 hover:bg-gray-100 rounded flex-shrink-0"
                    >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* content */}
                    <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-semibold text-lg truncate">{link.title}</h3>
                        <p className="text-gray-600 text-sm truncate">{link.url}</p>
                    </div>

                    {/* action buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">

                        {/* analytics button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                        >
                            <Link
                                href={`/dashboard/link/${id}`}
                            >
                                <BarChart3 className="w-3.5 h-3.5 text-green-500" />
                            </Link>
                        </Button>

                        {/* edit button */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                setIsEditing(true);
                            }}
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>

                        {/* delete button */}
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation();

                                const isConfirmed = confirm(
                                    `Bạn có chắc chắn muốn xóa "${link.title}"?\n\nHành động này không thể hoàn tác.`
                                );

                                if (isConfirmed) {
                                    deleteLink({ linkId: id })
                                }
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SortableItem;

