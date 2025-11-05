"use client";

import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,

} from "@dnd-kit/sortable";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import SortableItem from "./SortableItem";
import { Id } from "@/convex/_generated/dataModel";

const ManageLinks = ({ preloadedLinks }: { preloadedLinks: Preloaded<typeof api.lib.links.getLinksByUserId> }) => {
    const links = usePreloadedQuery(preloadedLinks);

    const updateLinkOrder = useMutation(api.lib.links.updateLinkOrder);

    const [items, setItems] = useState(links.map((link) => link._id));

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    /**
     * Reorders local item IDs after a drag-and-drop interaction and persists the new sequence.
     *
     * If the dragged item was moved to a different position, updates component state with the new item ID order and calls `updateLinkOrder` to save the order.
     *
     * @param event - Drag end event from dnd-kit containing the `active` (dragged) and `over` (target) items
     */
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as Id<"links">);
                const newIndex = items.indexOf(over?.id as Id<"links">);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update the links order in the database
                updateLinkOrder({ linkIds: newItems });

                return newItems;
            });
        }
    }

    // Create a map for quick link lookup
    const linkMap = useMemo(() => {
        return Object.fromEntries(links.map((link) => [link._id, link]));
    }, [links]);

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {items.map((id) => {
                            const link = linkMap[id];
                            return <SortableItem key={id} id={id} link={link} />;
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-600 hover:text-white transition-all duration-200 mt-4"
                asChild
            >
                <Link
                    href="/dashboard/new-link"
                    className="flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Thêm liên kết
                </Link>
            </Button>
        </>
    )
}

export default ManageLinks