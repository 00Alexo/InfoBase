import React from 'react';
import { 
    Card, 
    CardBody,
    Progress,
    Button
} from '@heroui/react';
import { 
    FaCrown,
    FaGem,
    FaStar,
    FaRocket,
    FaBullseye
} from 'react-icons/fa';

const RankTab = ({ enhancedProfile }) => {
    if (!enhancedProfile) return null;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Coding Ranks & Progression</h2>
                <p className="text-gray-400">Your journey from beginner to expert based on achievements and problem-solving skills.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-8 text-center">
                        <div className={`text-6xl mb-4 ${
                            enhancedProfile.rank === 'Expert' ? 'text-red-500' :
                            enhancedProfile.rank === 'Advanced' ? 'text-purple-500' :
                            enhancedProfile.rank === 'Intermediate' ? 'text-blue-500' : 'text-green-500'
                        }`}>
                            {enhancedProfile.rank === 'Expert' && <FaCrown />}
                            {enhancedProfile.rank === 'Advanced' && <FaGem />}
                            {enhancedProfile.rank === 'Intermediate' && <FaStar />}
                            {enhancedProfile.rank === 'Beginner' && <FaRocket />}
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">{enhancedProfile.rank}</h3>
                        <p className="text-gray-400 mb-4">Your current coding rank</p>
                        <div className="text-lg font-semibold text-green-400 mb-2">
                            {enhancedProfile.achievements.filter(a => a.unlocked).length} achievements unlocked
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-8">
                        <h3 className="text-xl font-semibold text-white mb-6">Rank Progression</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl text-green-500"><FaRocket /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold ${enhancedProfile.rank === 'Beginner' ? 'text-green-400' : 'text-gray-400'}`}>
                                            Beginner
                                        </span>
                                        <span className="text-gray-400">0-2 achievements</span>
                                    </div>
                                    <Progress 
                                        value={enhancedProfile.rank === 'Beginner' ? 100 : 100}
                                        color="success"
                                        size="sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-3xl text-blue-500"><FaStar /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold ${enhancedProfile.rank === 'Intermediate' ? 'text-blue-400' : 'text-gray-400'}`}>
                                            Intermediate
                                        </span>
                                        <span className="text-gray-400">3-5 achievements</span>
                                    </div>
                                    <Progress 
                                        value={
                                            enhancedProfile.rank === 'Beginner' ? 0 :
                                            enhancedProfile.rank === 'Intermediate' ? 100 : 100
                                        }
                                        color="primary"
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-3xl text-purple-500"><FaGem /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold ${enhancedProfile.rank === 'Advanced' ? 'text-purple-400' : 'text-gray-400'}`}>
                                            Advanced
                                        </span>
                                        <span className="text-gray-400">6-9 achievements</span>
                                    </div>
                                    <Progress 
                                        value={
                                            ['Beginner', 'Intermediate'].includes(enhancedProfile.rank) ? 0 :
                                            enhancedProfile.rank === 'Advanced' ? 100 : 100
                                        }
                                        color="secondary"
                                        size="sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-3xl text-red-500"><FaCrown /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`font-semibold ${enhancedProfile.rank === 'Expert' ? 'text-red-400' : 'text-gray-400'}`}>
                                            Expert
                                        </span>
                                        <span className="text-gray-400">10+ achievements</span>
                                    </div>
                                    <Progress 
                                        value={enhancedProfile.rank === 'Expert' ? 100 : 0}
                                        color="danger"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <Card className="bg-green-500/10 border-green-500/30">
                    <CardBody className="p-6 text-center">
                        <FaRocket className="text-3xl text-green-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-green-400 mb-2">Beginner</h3>
                    </CardBody>
                </Card>

                <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardBody className="p-6 text-center">
                        <FaStar className="text-3xl text-blue-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-blue-400 mb-2">Intermediate</h3>
                    </CardBody>
                </Card>

                <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardBody className="p-6 text-center">
                        <FaGem className="text-3xl text-purple-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-purple-400 mb-2">Advanced</h3>
                    </CardBody>
                </Card>

                <Card className="bg-red-500/10 border-red-500/30">
                    <CardBody className="p-6 text-center">
                        <FaCrown className="text-3xl text-red-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-red-400 mb-2">Expert</h3>
                    </CardBody>
                </Card>
            </div>

            <Card className="bg-bgCustomLight border-gray-700/30">
                <CardBody className="p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                        <FaBullseye className="text-yellow-400" />
                        Next Rank Goal
                    </h3>
                    
                    {enhancedProfile.rank !== 'Expert' ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">
                                    Progress to {
                                        enhancedProfile.rank === 'Beginner' ? 'Intermediate' :
                                        enhancedProfile.rank === 'Intermediate' ? 'Advanced' : 'Expert'
                                    }
                                </span>
                                <span className="text-gray-400">
                                    {enhancedProfile.achievements.filter(a => a.unlocked).length}/
                                    {enhancedProfile.rank === 'Beginner' ? '3' :
                                     enhancedProfile.rank === 'Intermediate' ? '6' : '10'}
                                </span>
                            </div>
                            <Progress 
                                value={
                                    enhancedProfile.rank === 'Beginner' ? 
                                        (enhancedProfile.achievements.filter(a => a.unlocked).length / 3) * 100 :
                                    enhancedProfile.rank === 'Intermediate' ? 
                                        (enhancedProfile.achievements.filter(a => a.unlocked).length / 6) * 100 :
                                        (enhancedProfile.achievements.filter(a => a.unlocked).length / 10) * 100
                                }
                                color="warning"
                                size="lg"
                            />
                            <p className="text-gray-400 text-sm">
                                Keep solving problems and unlocking achievements to reach the next rank!
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FaCrown className="text-6xl text-red-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Maximum Rank Achieved!</h3>
                            <p className="text-gray-400">You've reached the highest rank. Keep solving problems to maintain your expertise!</p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default RankTab;