import React from 'react';
import { 
    Card, 
    CardBody, 
    Button,
    Input
} from '@heroui/react';
import { 
    FaUser,
    FaEdit,
    FaSave,
    FaTimes,
    FaMapMarkerAlt,
    FaGlobe,
    FaGithub,
    FaLinkedin,
    FaUserFriends
} from 'react-icons/fa';

const SettingsTab = ({ 
    updateError,
    updateSuccess,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    profile,
    handleProfileSave,
    updateLoading,
    setUpdateError,
    setUpdateSuccess
}) => {
    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            bio: '',
            location: '',
            website: '',
            github: '',
            linkedin: '',
            gender: ''
        });
        setUpdateError(null);
        setUpdateSuccess(false);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Profile Settings</h2>
            
            {updateError && (
                <Card className="bg-red-500/10 border-red-500/30 mb-6">
                    <CardBody className="p-4">
                        <div className="text-red-400 text-sm font-medium">{updateError}</div>
                    </CardBody>
                </Card>
            )}
            
            {updateSuccess && (
                <Card className="bg-green-500/10 border-green-500/30 mb-6">
                    <CardBody className="p-4">
                        <div className="text-green-400 text-sm font-medium">Profile updated successfully!</div>
                    </CardBody>
                </Card>
            )}
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <FaUser className="text-red-400" />
                                Personal Information
                            </h3>
                            {!isEditing && (
                                <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    startContent={<FaEdit />}
                                    onPress={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Bio
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Tell us about yourself..."
                                    value={editForm.bio || profile?.bio || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                    disabled={!isEditing}
                                    size="lg"
                                    classNames={{
                                        input: "text-white focus:outline-none",
                                        inputWrapper: "bg-gray-800 border-gray-600 hover:border-red-500/50 focus-within:!border-red-500 focus-within:!ring-0 focus-within:!outline-none"
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Location
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Your location"
                                    value={editForm.location || profile?.location || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                    disabled={!isEditing}
                                    size="lg"
                                    startContent={<FaMapMarkerAlt className="text-gray-400" />}
                                    classNames={{
                                        input: "text-white focus:outline-none",
                                        inputWrapper: "bg-gray-800 border-gray-600 hover:border-red-500/50 focus-within:!border-red-500 focus-within:!ring-0 focus-within:!outline-none"
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Website
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://your-website.com"
                                    value={editForm.website || profile?.website || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                                    disabled={!isEditing}
                                    size="lg"
                                    startContent={<FaGlobe className="text-gray-400" />}
                                    classNames={{
                                        input: "text-white focus:outline-none",
                                        inputWrapper: "bg-gray-800 border-gray-600 hover:border-red-500/50 focus-within:!border-red-500 focus-within:!ring-0 focus-within:!outline-none"
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Gender
                                </label>
                                <select
                                    value={editForm.gender || profile?.gender || 'Unspecified'}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="Unspecified">Prefer not to say</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            {isEditing && (
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        startContent={<FaSave />}
                                        onPress={handleProfileSave}
                                        isLoading={updateLoading}
                                    >
                                        Save Profile & Social Links
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="bordered"
                                        className="border-gray-600 hover:border-red-500/50 text-gray-300"
                                        startContent={<FaTimes />}
                                        onPress={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-bgCustomLight border-gray-700/30">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <FaUserFriends className="text-blue-400" />
                            Social Links
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    GitHub Username
                                </label>
                                <Input
                                    type="text"
                                    placeholder="your-github-username"
                                    value={editForm.github || profile?.github || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))}
                                    disabled={!isEditing}
                                    size="lg"
                                    startContent={<FaGithub className="text-gray-400" />}
                                    classNames={{
                                        input: "text-white focus:outline-none",
                                        inputWrapper: "bg-gray-800 border-gray-600 hover:border-red-500/50 focus-within:!border-red-500 focus-within:!ring-0 focus-within:!outline-none"
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    LinkedIn Profile
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://linkedin.com/in/your-profile"
                                    value={editForm.linkedin || profile?.linkedin || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))}
                                    disabled={!isEditing}
                                    size="lg"
                                    startContent={<FaLinkedin className="text-gray-400" />}
                                    classNames={{
                                        input: "text-white focus:outline-none",
                                        inputWrapper: "bg-gray-800 border-gray-600 hover:border-red-500/50 focus-within:!border-red-500 focus-within:!ring-0 focus-within:!outline-none"
                                    }}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default SettingsTab;