"use client";
import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskDetailDrawer } from "@/components/shared/TaskDetailDrawer";
import { DroppableColumn, UserTooltip } from "./components";

interface BoardViewProps {
    sections: any[];
    onAddTask: (sectionId: string) => void;
    onAddSubtask: (taskId: string) => void;
    onEditTask: (taskId: string, updates: any) => void;
    onDeleteTask: (taskId: string) => void;
    onAssignTask: (taskId: string, userId: string) => void;
    onUnassignTask: (taskId: string, userId: string) => void;
    onStatusChange?: (taskId: string, newStatusId: string) => void;
}

const BoardViewContent: React.FC<BoardViewProps> = ({
    sections,
    onAddTask,
    onAddSubtask,
    onEditTask,
    onDeleteTask,
    onAssignTask,
    onUnassignTask,
    onStatusChange,
}) => {
    const [hoveredUser, setHoveredUser] = useState<{ id: string; name: string; rect: DOMRect } | null>(null);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    const handleDrop = useCallback((taskId: string, fromSectionId: string, toSectionId: string) => {
        if (onStatusChange) {
            onStatusChange(taskId, toSectionId);
        } else {
            onEditTask(taskId, { phase_object_id: toSectionId });
        }
    }, [onStatusChange, onEditTask]);

    return (
        <>
            <div className="flex gap-4 overflow-x-auto pb-4 hidescroll">
                {sections.map((section, index) => (
                    <DroppableColumn
                        key={section.id}
                        section={section}
                        index={index}
                        onDrop={handleDrop}
                        onAddTask={onAddTask}
                        onTaskClick={setSelectedTask}
                        onHoverUser={setHoveredUser}
                    />
                ))}
            </div>

            <UserTooltip hoveredUser={hoveredUser} />

            <TaskDetailDrawer
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onAddSubtask={onAddSubtask}
                onAssignTask={onAssignTask}
                onUnassignTask={onUnassignTask}
            />
        </>
    );
};

const BoardView: React.FC<BoardViewProps> = (props) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <BoardViewContent {...props} />
        </DndProvider>
    );
};

export default BoardView;
