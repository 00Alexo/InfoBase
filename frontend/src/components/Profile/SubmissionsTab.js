import React from 'react';
import { 
    Card, 
    CardBody, 
    Tabs, 
    Tab,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Chip
} from '@heroui/react';
import { 
    FaCode, 
    FaFilter,
    FaChevronDown,
    FaClock,
    FaSortAmountDown,
    FaCheckCircle,
    FaClock as FaClockIcon,
    FaTimesCircle,
    FaEye,
    FaChartBar
} from 'react-icons/fa';

const SubmissionsTab = ({ 
    filteredSubmissions, 
    filterStatus, 
    setFilterStatus,
    selectedPeriod,
    setSelectedPeriod,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    formatDate,
    getScoreColor
}) => {
    return (
        <div className="p-8">
            <div className="flex flex-wrap gap-4 mb-8">
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            size="lg"
                            className="border-gray-600 hover:border-red-500/50 text-white bg-bgCustomLight"
                            startContent={<FaFilter />}
                            endContent={<FaChevronDown />}
                        >
                            Status: {filterStatus === "all" ? "All" : filterStatus === "solved" ? "Solved" : filterStatus === "partial" ? "Partial" : "Unsolved"}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        selectedKeys={[filterStatus]}
                        selectionMode="single"
                        onSelectionChange={(keys) => setFilterStatus(Array.from(keys)[0])}
                    >
                        <DropdownItem key="all">All Submissions</DropdownItem>
                        <DropdownItem key="solved">Solved (≥100pts)</DropdownItem>
                        <DropdownItem key="partial">Partial (1-99pts)</DropdownItem>
                        <DropdownItem key="unsolved">Unsolved (0pts)</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            size="lg"
                            className="border-gray-600 hover:border-red-500/50 text-white bg-bgCustomLight"
                            startContent={<FaClock />}
                            endContent={<FaChevronDown />}
                        >
                            Period: {selectedPeriod === "all" ? "All Time" : selectedPeriod === "week" ? "This Week" : selectedPeriod === "month" ? "This Month" : "This Year"}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        selectedKeys={[selectedPeriod]}
                        selectionMode="single"
                        onSelectionChange={(keys) => setSelectedPeriod(Array.from(keys)[0])}
                    >
                        <DropdownItem key="all">All Time</DropdownItem>
                        <DropdownItem key="week">This Week</DropdownItem>
                        <DropdownItem key="month">This Month</DropdownItem>
                        <DropdownItem key="year">This Year</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            size="lg"
                            className="border-gray-600 hover:border-red-500/50 text-white bg-bgCustomLight"
                            startContent={<FaSortAmountDown />}
                            endContent={<FaChevronDown />}
                        >
                            Sort: {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "score_high" ? "Score ↓" : sortBy === "score_low" ? "Score ↑" : "Problem ID"}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        selectedKeys={[sortBy]}
                        selectionMode="single"
                        onSelectionChange={(keys) => setSortBy(Array.from(keys)[0])}
                    >
                        <DropdownItem key="newest">Newest First</DropdownItem>
                        <DropdownItem key="oldest">Oldest First</DropdownItem>
                        <DropdownItem key="score_high">Highest Score</DropdownItem>
                        <DropdownItem key="score_low">Lowest Score</DropdownItem>
                        <DropdownItem key="problem_id">Problem ID</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant={viewMode === "grid" ? "solid" : "bordered"}
                        color={viewMode === "grid" ? "danger" : "default"}
                        size="lg"
                        onPress={() => setViewMode("grid")}
                        className={viewMode !== "grid" ? "border-gray-600 hover:border-red-500/50" : ""}
                    >
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "solid" : "bordered"}
                        color={viewMode === "list" ? "danger" : "default"}
                        size="lg"
                        onPress={() => setViewMode("list")}
                        className={viewMode !== "list" ? "border-gray-600 hover:border-red-500/50" : ""}
                    >
                        List
                    </Button>
                </div>
            </div>

            {filteredSubmissions.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {filteredSubmissions.map((submission, index) => (
                            <Card key={index} className="bg-bgCustomLight border-gray-700/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
                                <CardBody className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-full ${submission.score >= 100 ? 'bg-green-500/20 text-green-400' : submission.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {submission.score >= 100 ? <FaCheckCircle /> : submission.score >= 50 ? <FaClockIcon /> : <FaTimesCircle />}
                                            </div>
                                            <h3 className="text-white font-bold text-lg">#{submission.problemId}</h3>
                                        </div>
                                        <Chip
                                            size="lg"
                                            color={getScoreColor(submission.score)}
                                            variant="flat"
                                            className="font-bold"
                                        >
                                            {submission.score}
                                        </Chip>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-400">
                                            {formatDate(submission.date)}
                                        </div>
                                    
                                        
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                                startContent={<FaEye />}
                                                onPress={() => {
                                                    window.open(`/problems/${submission.problemId}`, '_blank');
                                                }}
                                            >
                                                View Problem
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredSubmissions.map((submission, index) => (
                            <Card key={index} className="bg-bgCustomLight border-gray-700/30 hover:border-red-500/30 transition-colors">
                                <CardBody className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`p-3 rounded-full ${submission.score >= 100 ? 'bg-green-500/20 text-green-400' : submission.score >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {submission.score >= 100 ? <FaCheckCircle className="text-xl" /> : submission.score >= 50 ? <FaClockIcon className="text-xl" /> : <FaTimesCircle className="text-xl" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-white font-bold text-xl">
                                                        Problem #{submission.problemId}
                                                    </h3>
                                                    <Chip
                                                        size="lg"
                                                        color={getScoreColor(submission.score)}
                                                        variant="flat"
                                                        className="font-bold"
                                                    >
                                                        {submission.score} pts
                                                    </Chip>
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <FaClock className="text-sm" />
                                                        {formatDate(submission.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                size="lg"
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                startContent={<FaEye />}
                                                onPress={() => {
                                                    window.open(`/problems/${submission.problemId}`, '_blank');
                                                }}
                                            >
                                                View Problem
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-6xl mb-6 text-gray-400"><FaChartBar /></div>
                    <h3 className="text-2xl font-bold text-gray-400 mb-4">No submissions found</h3>
                    <p className="text-xl text-gray-500 mb-6">
                        {filterStatus !== "all" || selectedPeriod !== "all" 
                            ? "Try adjusting your filters to see more results." 
                            : "No submissions have been made yet."
                        }
                    </p>
                    {(filterStatus !== "all" || selectedPeriod !== "all") && (
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onPress={() => {
                                setFilterStatus("all");
                                setSelectedPeriod("all");
                            }}
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubmissionsTab;