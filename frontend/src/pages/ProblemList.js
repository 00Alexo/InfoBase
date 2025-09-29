import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaTimes, FaClock, FaUser, FaTag, FaCheckCircle, FaCode, FaSortAmountDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Button, Chip, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Pagination } from "@heroui/react";

const ProblemList = () => {
    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProblems, setTotalProblems] = useState(0);
    const itemsPerPage = 20;

    const availableClasses = ["IX", "X", "XI"];
    const availableTags = [
        "Base programming elements", "Elementary algorithms", 
        "One-dimensional tables (Arrays)", "Two-dimensional arrays (matrices)", 
        "Functions", "Recursion", "DivideEtImpera", "Chars & Strings",
        "Backtracking", "Greedy Method", "Dynamic Programming", 
        "Graph Theory", "OOP"
    ];

    const getProblems = async (page = 1, filters = {}) => {
        setIsLoading(true);
        try {
            // Build query parameters
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: itemsPerPage.toString()
            });

            // Add filter parameters if they exist
            if (filters.search && filters.search.trim()) {
                queryParams.append('search', filters.search.trim());
            }
            if (filters.selectedTags && filters.selectedTags.length > 0) {
                filters.selectedTags.forEach(tag => queryParams.append('tags', tag));
            }
            if (filters.selectedClasses && filters.selectedClasses.length > 0) {
                filters.selectedClasses.forEach(className => queryParams.append('classes', className));
            }
            if (filters.selectedDifficulty && filters.selectedDifficulty.trim()) {
                queryParams.append('difficulty', filters.selectedDifficulty.trim());
            }
            if (filters.sortBy && filters.sortBy.trim()) {
                queryParams.append('sortBy', filters.sortBy.trim());
            }

            console.log("Fetching with query:", queryParams.toString());

            const response = await fetch(`${process.env.REACT_APP_API}/problems/getProblems?${queryParams.toString()}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const json = await response.json();

            if(response.ok){
                setProblems(json.problems);
                setTotalProblems(json.pagination.totalProblems);
                setTotalPages(json.pagination.totalPages);
                setCurrentPage(json.pagination.currentPage);
                console.log("Problems received:", json.problems);
                console.log("Pagination:", json.pagination);
                console.log("Applied filters:", json.filters);
            }

            if(!response.ok){
                console.log(json.error);
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Load problems when component mounts or filters/pagination change
    useEffect(() => {
        const currentFilters = {
            search: searchTerm,
            selectedTags,
            selectedClasses,
            selectedDifficulty,
            sortBy
        };
        getProblems(currentPage, currentFilters);
    }, [currentPage, searchTerm, selectedTags, selectedClasses, selectedDifficulty, sortBy]);

    // Reset to page 1 when filters change (except on initial load)
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [searchTerm, selectedTags, selectedClasses, selectedDifficulty, sortBy]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Easy": return "text-green-400 bg-green-900/20 border-green-500/30";
            case "Medium": return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
            case "Hard": return "text-red-400 bg-red-900/20 border-red-500/30";
            default: return "text-gray-400 bg-gray-900/20 border-gray-500/30";
        }
    };

    const clearAllFilters = () => {
        setSelectedTags([]);
        setSelectedClasses([]);
        setSelectedDifficulty("");
        setSearchTerm("");
        setSortBy("newest");
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const toggleClass = (className) => {
        setSelectedClasses(prev => 
            prev.includes(className) 
                ? prev.filter(c => c !== className)
                : [...prev, className]
        );
    };

    return (
        <div className="min-h-screen bg-bgCustomPage">
            <div className="bg-bgCustomCard/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-[65px] z-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-white mb-1">
                                    Problems
                                </h1>
                                <p className="text-sm text-textCustomMuted">
                                    {isLoading ? "Loading..." : `Showing ${Math.min(problems.length, itemsPerPage)} of ${totalProblems} problems`}
                                    {(selectedTags.length > 0 || selectedClasses.length > 0 || selectedDifficulty || searchTerm) && (
                                        <span className="ml-2 text-red-400">
                                            • {selectedTags.length + selectedClasses.length + (selectedDifficulty ? 1 : 0)} filters applied
                                        </span>
                                    )}
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 lg:w-80">
                                    <Input
                                        type="text"
                                        placeholder="Search problems..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        startContent={<FaSearch className="text-gray-400 text-sm" />}
                                        classNames={{
                                            base: "h-10",
                                            mainWrapper: "h-full",
                                            input: "text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0",
                                            inputWrapper: "h-full bg-bgCustomLight border border-gray-600 hover:border-red-500/50 focus-within:!border-red-500 shadow-none data-[focus=true]:shadow-none data-[hover=true]:shadow-none"
                                        }}
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <Dropdown placement="bottom-end">
                                        <DropdownTrigger>
                                            <Button
                                                variant="bordered"
                                                size="sm"
                                                className="border-gray-600 hover:border-red-500/50 text-textCustomPrimary bg-bgCustomLight h-10"
                                                startContent={<FaSortAmountDown className="text-xs" />}
                                            >
                                                Sort
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            selectedKeys={[sortBy]}
                                            selectionMode="single"
                                            onSelectionChange={(keys) => setSortBy(Array.from(keys)[0])}
                                        >
                                            <DropdownItem key="newest">Newest First</DropdownItem>
                                            <DropdownItem key="oldest">Oldest First</DropdownItem>
                                            <DropdownItem key="title">Title A-Z</DropdownItem>
                                            <DropdownItem key="difficulty">By Difficulty</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>

                                    <Button
                                        size="sm"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`h-10 font-medium ${
                                            showFilters || selectedTags.length > 0 || selectedClasses.length > 0 || selectedDifficulty
                                                ? "bg-red-600 text-white"
                                                : "bg-bgCustomLight border border-gray-600 hover:border-red-500/50 text-textCustomPrimary"
                                        }`}
                                        startContent={<FaFilter className="text-xs" />}
                                        endContent={
                                            (selectedTags.length + selectedClasses.length + (selectedDifficulty ? 1 : 0)) > 0 && (
                                                <span className="bg-white text-red-600 px-1.5 py-0.5 rounded-full text-xs font-semibold min-w-5 h-5 flex items-center justify-center">
                                                    {selectedTags.length + selectedClasses.length + (selectedDifficulty ? 1 : 0)}
                                                </span>
                                            )
                                        }
                                    >
                                        Filters
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-700/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-white">Filters</h3>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onClick={clearAllFilters}
                                        className="text-red-400 hover:text-red-300 h-8"
                                        startContent={<FaTimes className="text-xs" />}
                                    >
                                        Clear All
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Academic Level</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {availableClasses.map(className => (
                                                <Button
                                                    key={className}
                                                    size="sm"
                                                    onClick={() => toggleClass(className)}
                                                    className={`h-8 px-3 text-sm ${
                                                        selectedClasses.includes(className)
                                                            ? "bg-green-600 text-white"
                                                            : "bg-bgCustomLight border border-gray-600 hover:border-green-500 text-gray-300"
                                                    }`}
                                                >
                                                    Class {className}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Difficulty</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {["Easy", "Medium", "Hard"].map(difficulty => (
                                                <Button
                                                    key={difficulty}
                                                    size="sm"
                                                    onClick={() => setSelectedDifficulty(
                                                        selectedDifficulty === difficulty ? "" : difficulty
                                                    )}
                                                    className={`h-8 px-3 text-sm ${
                                                        selectedDifficulty === difficulty
                                                            ? difficulty === "Easy" 
                                                                ? "bg-green-600 text-white"
                                                                : difficulty === "Medium"
                                                                ? "bg-yellow-600 text-white" 
                                                                : "bg-red-600 text-white"
                                                            : "bg-bgCustomLight border border-gray-600 hover:border-red-500 text-gray-300"
                                                    }`}
                                                >
                                                    {difficulty}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-300 mb-3">Programming Topics</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5">
                                            {availableTags.map(tag => (
                                                <Button
                                                    key={tag}
                                                    size="sm"
                                                    onClick={() => toggleTag(tag)}
                                                    className={`h-8 px-2 text-xs text-left justify-start ${
                                                        selectedTags.includes(tag)
                                                            ? "bg-red-600 text-white"
                                                            : "bg-bgCustomLight border border-gray-600 hover:border-red-500 text-gray-300"
                                                    }`}
                                                >
                                                    <span className="truncate">
                                                        {tag.length > 20 ? `${tag.substring(0, 20)}...` : tag}
                                                    </span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                            <span className="text-textCustomMuted">Loading problems...</span>
                        </div>
                    </div>
                ) : problems.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
                        <p className="text-textCustomMuted mb-6">
                            {totalProblems === 0 
                                ? "No problems have been created yet."
                                : "No problems match your current filters."
                            }
                        </p>
                        {(selectedTags.length > 0 || selectedClasses.length > 0 || selectedDifficulty || searchTerm) && (
                            <Button
                                onClick={clearAllFilters}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                startContent={<FaTimes />}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Desktop Header - Hidden on mobile */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-bgCustomCard/50 rounded-lg border border-gray-700/50 text-sm font-medium text-gray-400 uppercase tracking-wide">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-6">Title</div>
                            <div className="col-span-2">Difficulty</div>
                            <div className="col-span-3">Tags</div>
                        </div>

                        {problems.map((problem, index) => (
                            <Link
                                key={problem._id}
                                to={`/problems/${problem.uniqueId}`}
                                className="block"
                            >
                                {/* Desktop Layout */}
                                <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-4 bg-bgCustomCard hover:bg-bgCustomCard/80 rounded-lg border border-gray-700/30 hover:border-red-500/50 transition-all duration-200 group">
                                    <div className="col-span-1 flex items-center justify-center">
                                        <span className="text-sm font-mono text-gray-400 group-hover:text-red-400">
                                            {problem.uniqueId}
                                        </span>
                                    </div>
                                    <div className="col-span-6 flex flex-col justify-center min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-white font-medium group-hover:text-red-400 transition-colors truncate">
                                                {problem.title}
                                            </h3>
                                            {problem.official && (
                                                <Chip size="sm" className="bg-blue-900/20 text-blue-400 border border-blue-500/30 text-xs">
                                                    Official
                                                </Chip>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 truncate">
                                            {problem.description}
                                        </p>
                                    </div>

                                    <div className="col-span-2 flex items-center">
                                        <Chip
                                            size="sm"
                                            className={`${getDifficultyColor(problem.difficulty)} font-medium`}
                                        >
                                            {problem.difficulty}
                                        </Chip>
                                    </div>

                                    <div className="col-span-3 flex items-center">
                                        <div className="flex flex-wrap gap-1 w-full">
                                            {problem.tags && problem.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <Chip
                                                    key={tagIndex}
                                                    size="sm"
                                                    className={`text-xs ${
                                                        tag.class 
                                                            ? "bg-green-900/20 text-green-400 border border-green-500/30" 
                                                            : "bg-red-900/20 text-red-400 border border-red-500/30"
                                                    }`}
                                                >
                                                    {tag.name}
                                                </Chip>
                                            ))}
                                            {problem.tags && problem.tags.length > 3 && (
                                                <Chip size="sm" className="bg-gray-900/20 text-gray-400 border border-gray-500/30 text-xs">
                                                    +{problem.tags.length - 3}
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Layout */}
                                <div className="lg:hidden px-4 py-4 bg-bgCustomCard hover:bg-bgCustomCard/80 rounded-lg border border-gray-700/30 hover:border-red-500/50 transition-all duration-200 group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-gray-400 group-hover:text-red-400 px-2 py-1 bg-gray-800 rounded">
                                                    #{problem.uniqueId}
                                                </span>
                                                {problem.official && (
                                                    <Chip size="sm" className="bg-blue-900/20 text-blue-400 border border-blue-500/30 text-xs">
                                                        Official
                                                    </Chip>
                                                )}
                                            </div>
                                            <h3 className="text-white font-medium group-hover:text-red-400 transition-colors text-sm leading-tight">
                                                {problem.title}
                                            </h3>
                                        </div>
                                        <Chip
                                            size="sm"
                                            className={`${getDifficultyColor(problem.difficulty)} font-medium text-xs flex-shrink-0`}
                                        >
                                            {problem.difficulty}
                                        </Chip>
                                    </div>
                                    
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                        {problem.description}
                                    </p>
                                    
                                    {problem.tags && problem.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.slice(0, 2).map((tag, tagIndex) => (
                                                <Chip
                                                    key={tagIndex}
                                                    size="sm"
                                                    className={`text-xs ${
                                                        tag.class 
                                                            ? "bg-green-900/20 text-green-400 border border-green-500/30" 
                                                            : "bg-red-900/20 text-red-400 border border-red-500/30"
                                                    }`}
                                                >
                                                    {tag.name.length > 15 ? `${tag.name.substring(0, 15)}...` : tag.name}
                                                </Chip>
                                            ))}
                                            {problem.tags.length > 2 && (
                                                <Chip size="sm" className="bg-gray-900/20 text-gray-400 border border-gray-500/30 text-xs">
                                                    +{problem.tags.length - 2} more
                                                </Chip>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <div className="text-sm text-gray-400 text-center">
                                    Page {currentPage} of {totalPages} • {totalProblems} total problems
                                </div>
                                
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                    <Button
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="bg-bgCustomLight border border-gray-600 hover:border-red-500/50 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        startContent={<FaChevronLeft className="text-xs" />}
                                    >
                                        <span className="hidden sm:inline">Previous</span>
                                        <span className="sm:hidden">Prev</span>
                                    </Button>
                                    
                                    <div className="flex items-center gap-1 max-w-full overflow-x-auto">
                                        {/* Show page numbers */}
                                        {(() => {
                                            const pages = [];
                                            const showPages = window.innerWidth < 640 ? 3 : 5; // Show fewer pages on mobile
                                            let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                                            let endPage = Math.min(totalPages, startPage + showPages - 1);
                                            
                                            // Adjust start if we're near the end
                                            if (endPage - startPage < showPages - 1) {
                                                startPage = Math.max(1, endPage - showPages + 1);
                                            }
                                            
                                            // Add first page and ellipsis if needed
                                            if (startPage > 1) {
                                                pages.push(
                                                    <Button
                                                        key={1}
                                                        size="sm"
                                                        onClick={() => handlePageChange(1)}
                                                        className="min-w-8 h-8 bg-bgCustomLight border border-gray-600 hover:border-red-500/50 text-gray-300 text-xs"
                                                    >
                                                        1
                                                    </Button>
                                                );
                                                if (startPage > 2) {
                                                    pages.push(
                                                        <span key="ellipsis-start" className="text-gray-400 px-1 text-xs">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                            }
                                            
                                            // Add page numbers
                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(
                                                    <Button
                                                        key={i}
                                                        size="sm"
                                                        onClick={() => handlePageChange(i)}
                                                        className={`min-w-8 h-8 text-xs ${
                                                            i === currentPage
                                                                ? "bg-red-600 text-white"
                                                                : "bg-bgCustomLight border border-gray-600 hover:border-red-500/50 text-gray-300"
                                                        }`}
                                                    >
                                                        {i}
                                                    </Button>
                                                );
                                            }
                                            
                                            // Add ellipsis and last page if needed
                                            if (endPage < totalPages) {
                                                if (endPage < totalPages - 1) {
                                                    pages.push(
                                                        <span key="ellipsis-end" className="text-gray-400 px-1 text-xs">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                pages.push(
                                                    <Button
                                                        key={totalPages}
                                                        size="sm"
                                                        onClick={() => handlePageChange(totalPages)}
                                                        className="min-w-8 h-8 bg-bgCustomLight border border-gray-600 hover:border-red-500/50 text-gray-300 text-xs"
                                                    >
                                                        {totalPages}
                                                    </Button>
                                                );
                                            }
                                            
                                            return pages;
                                        })()}
                                    </div>
                                    
                                    <Button
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="bg-bgCustomLight border border-gray-600 hover:border-red-500/50 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        endContent={<FaChevronRight className="text-xs" />}
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <span className="sm:hidden">Next</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 px-4 py-3 bg-bgCustomCard/30 rounded-lg border border-gray-700/30">
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>Showing {problems.length} problems on this page</span>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        <span>Classes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        <span>Topics</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProblemList;