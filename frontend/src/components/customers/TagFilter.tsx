import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { apiClient } from "../../lib/api";

interface TagFilterProps {
    selectedTags: string[];
    onTagChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, onTagChange }: TagFilterProps) {
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [popularTags, setPopularTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllTags, setShowAllTags] = useState(false);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            setLoading(true);

            // Load popular tags first
            const popularResponse = await apiClient.getPopularTags(10);
            if ("data" in popularResponse && popularResponse.data) {
                if (Array.isArray(popularResponse.data)) {
                    setPopularTags(popularResponse.data);
                } else if (
                    popularResponse.data.tags &&
                    Array.isArray(popularResponse.data.tags)
                ) {
                    setPopularTags(popularResponse.data.tags);
                }
            }

            // Load all tags
            const allTagsResponse = await apiClient.getTags();
            if ("error" in allTagsResponse && allTagsResponse.error) {
                setError(allTagsResponse.error);
                return;
            }

            if ("data" in allTagsResponse && allTagsResponse.data) {
                // Handle both direct data array and nested tags object
                if (Array.isArray(allTagsResponse.data)) {
                    setAvailableTags(allTagsResponse.data);
                } else if (
                    allTagsResponse.data.tags &&
                    Array.isArray(allTagsResponse.data.tags)
                ) {
                    setAvailableTags(allTagsResponse.data.tags);
                }
            }
        } catch (err) {
            setError("Failed to load tags");
        } finally {
            setLoading(false);
        }
    };

    const handleTagToggle = (tag: string) => {
        // Convert tag to string and trim it
        const tagString = String(tag).trim();
        if (!tagString) return;

        const newSelectedTags = selectedTags.includes(tagString)
            ? selectedTags.filter((t) => t !== tagString)
            : [...selectedTags, tagString];
        onTagChange(newSelectedTags);
    };

    // Helper function to check if a tag is selected (with string conversion)
    const isTagSelected = (tag: string) => {
        const tagString = String(tag).trim();
        return selectedTags.includes(tagString);
    };

    const clearAllTags = () => {
        onTagChange([]);
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tags:</span>
                <div className="text-sm text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tags:</span>
                <div className="text-sm text-red-500">Error loading tags</div>
            </div>
        );
    }

    if (availableTags.length === 0) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tags:</span>
                <div className="text-sm text-gray-400">No tags available</div>
            </div>
        );
    }

    // Determine which tags to show
    const tagsToShow = showAllTags ? availableTags : popularTags;
    const hasMoreTags = availableTags.length > popularTags.length;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Tags:</span>
                <div className="flex flex-wrap gap-1">
                    {tagsToShow.map((tag) => (
                        <Button
                            key={tag}
                            variant={isTagSelected(tag) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTagToggle(tag)}
                            className={`text-xs ${
                                isTagSelected(tag)
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
                {selectedTags.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllTags}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Clear all
                    </Button>
                )}
            </div>

            {/* Show more/less button */}
            {hasMoreTags && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                    >
                        {showAllTags
                            ? "Show popular tags only"
                            : `Show all ${availableTags.length} tags`}
                    </Button>
                    {!showAllTags && (
                        <span className="text-xs text-gray-500">
                            Showing {popularTags.length} of{" "}
                            {availableTags.length} tags
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
