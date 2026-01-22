import { ITag } from "../tag.interface";

export interface TagPickerProps {
    selectedTagIds: string[];
    onAddTag: (tag: ITag) => void;
    onRemoveTag: (tagId: string) => void;
    onClose: () => void;
}