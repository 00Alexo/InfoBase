import {useCreateProblem} from '../Hooks/useCreateProblem';
import { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const CreateProblem = () => {
    const { createProblem, error, isLoading, errorFields } = useCreateProblem();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [timeout, setTimeout] = useState(5000);
    const [tags, setTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([
        {
            selected: false, name: 'IX', isClass: true, class: 'IX'
        },
        {
            selected: false, name: 'Base programming elements', isClass: false, class: 'IX'
        },
        {
            selected: false, name: 'Elementary algorithms', isClass: false, class: 'IX'
        },
        {
            selected: false, name: 'One-dimensional tables (Arrays)', isClass: false, class: 'IX'
        },
        {
            selected: false, name: 'Two-dimensional arrays (matrices)', isClass: false, class: 'IX'
        },
        {
            selected: false, name: 'X', isClass: true, class: 'X'
        },
        {
            selected: false, name: 'Functions', isClass: false, class: 'X'
        },
        {
            selected: false, name: 'Recursion', isClass: false, class: 'X'
        },
        {
            selected: false, name: 'DivideEtImpera', isClass: false, class: 'X'
        },
        {
            selected: false, name: 'Chars & Strings', isClass: false, class: 'X'
        },
        {
            selected: false, name: 'XI', isClass: true, class: 'XI'
        },
        {
            selected: false, name: 'Backtracking', isClass: false, class: 'XI'
        },
        {
            selected: false, name: 'Greedy Method', isClass: false, class: 'XI'
        },
        {
            selected: false, name: 'Dynamic Programming', isClass: false, class: 'XI'
        },
        {
            selected: false, name: 'Graph Theory', isClass: false, class: 'XI'
        },
        {
            selected: false, name: 'OOP', isClass: false, class: 'XI'
        }
    ]);
    const [cerinta, setCerinta] = useState('');
    const [DateDeIntrare, setDateDeIntrare] = useState('');
    const [DateDeIesire, setDateDeIesire] = useState('');
    const [Restrictii, setRestrictii] = useState(undefined);
    const [Precizari, setPrecizari] = useState(undefined);
    const [Exemple, setExemple] = useState([]);
    const [Teste, setTeste] = useState([]);


    const handleSubmit = (e) =>{
        e?.preventDefault();
        console.log('Tags before submitting:', JSON.stringify(tags, null, 2));
        createProblem(title, description, difficulty, tags, 
        cerinta, DateDeIntrare, DateDeIesire, Restrictii, Precizari, Exemple, Teste, timeout);
    }

    const [currentStep, setCurrentStep] = useState(1);
    const [showValidationError, setShowValidationError] = useState(false);
    const [showStep2ValidationError, setShowStep2ValidationError] = useState(false);
    const steps = [
        { number: 1, title: 'Basic Info', description: 'Problem details & statement' },
        { number: 2, title: 'Examples & Tests', description: 'Input/Output & test cases' }
    ];

    return (
        <div className='flex flex-col items-center p-10 gap-8'>
            <div className = "flex flex-row items-center gap-4">
                <FaPencilAlt size={24} className='mb-3'/>
                <h1 className="text-3xl font-bold mb-4">Create New Problem</h1>
            </div>
            <div className="flex items-center justify-center space-x-8">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                currentStep >= step.number 
                                    ? 'bg-primaryCustom text-white' 
                                    : 'bg-bgCustomCard text-textCustomMuted border-2 border-borderCustom'
                            }`}>
                                {step.number}
                            </div>
                            <div className="ml-3 hidden sm:block">
                                <div className={`font-semibold ${
                                    currentStep >= step.number ? 'text-primaryCustom' : 'text-textCustomMuted'
                                }`}>
                                    {step.title}
                                </div>
                                <div className="text-sm text-textCustomSecondary">
                                    {step.description}
                                </div>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-16 h-1 mx-4 ${
                                currentStep > step.number ? 'bg-primaryCustom' : 'bg-borderCustom'
                            }`}></div>
                        )}
                    </div>
                ))}
            </div>
            <div className="max-w-4xl w-full bg-gradient-to-br from-bgCustomCard/80 flex flex-col justify-between min-h-[400px]
            to-bgCustomLight/87 backdrop-blur-[10px] rounded-[20px] border-[#37415160]
            shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(55,65,81,0.38)] p-4 border mt-6">
                <div className='mb-8'>
                    {currentStep === 1 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6 border-b border-borderCustom pb-3">
                                <h2 className="text-2xl font-bold text-textCustomPrimary">
                                    Information
                                </h2>
                                {showValidationError && (!title.trim() || !description.trim() || !difficulty || tags.length === 0 || !cerinta.trim()) && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                                        <div className="text-red-400 text-sm font-medium">
                                            Missing: {[
                                                !title.trim() && 'Title',
                                                !description.trim() && 'Description', 
                                                !difficulty && 'Difficulty',
                                                tags.length === 0 && 'Tags',
                                                !cerinta.trim() && 'Statement'
                                            ].filter(Boolean).join(', ')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Problem Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300"
                                        placeholder="Enter a unique problem title..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Difficulty *
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300"
                                        required
                                    >
                                        <option value="">Select difficulty</option>
                                        <option value="Easy"> Easy</option>
                                        <option value="Medium"> Medium</option>
                                        <option value="Hard"> Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-textCustomPrimary font-semibold mb-2">
                                    Short Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300 resize-vertical"
                                    placeholder="Brief description of the problem..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-textCustomPrimary font-semibold mb-2">
                                    Tags * (minimum 1)
                                </label>
                                <div className="space-y-6">
                                    <div>
                                        <div className="mb-3">
                                            {availableTags.filter(tag => tag.isClass && tag.class === 'IX').map((classTag, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedTags = [...availableTags];
                                                        updatedTags.forEach((tag, i) => {
                                                            if (tag.isClass && tag.name !== classTag.name) {
                                                                updatedTags[i].selected = false;
                                                            }
                                                        });
                                                        const tagIndex = availableTags.findIndex(t => t.name === classTag.name);
                                                        updatedTags[tagIndex].selected = !updatedTags[tagIndex].selected;
                                                        setAvailableTags(updatedTags);
                                                        
                                                        let newTags = tags.filter(t => !availableTags.find(at => at.name === t.name && at.isClass));
                                                        if (updatedTags[tagIndex].selected) {
                                                            newTags.push({ name: updatedTags[tagIndex].name, class: true });
                                                        }
                                                        setTags(newTags);
                                                    }}
                                                    className={`px-4 py-2 rounded-full border font-bold text-lg ${
                                                        classTag.selected
                                                            ? 'bg-green-600 text-white border-green-600 shadow-lg'
                                                            : 'bg-bgCustomCard text-textCustomPrimary border-borderCustom hover:bg-bgCustomCardHover hover:border-green-400'
                                                    } transition-all duration-300`}
                                                >
                                                    {classTag.name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableTags.filter(tag => !tag.isClass && tag.class === 'IX').map((tag, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedTags = [...availableTags];
                                                        const tagIndex = availableTags.findIndex(t => t.name === tag.name);
                                                        updatedTags[tagIndex].selected = !updatedTags[tagIndex].selected;
                                                        setAvailableTags(updatedTags);
                                                        if (updatedTags[tagIndex].selected) {
                                                            setTags([...tags, { name: updatedTags[tagIndex].name, class: false }]);
                                                        } else {
                                                            setTags(tags.filter(t => t.name !== updatedTags[tagIndex].name));
                                                        }
                                                    }}
                                                    className={`px-3 py-2 rounded-full border text-sm ${
                                                        tag.selected
                                                            ? 'bg-primaryCustom text-white border-primaryCustom shadow-lg'
                                                            : 'bg-bgCustomCard text-textCustomPrimary border-borderCustom hover:bg-bgCustomCardHover hover:border-primaryCustom/50'
                                                    } transition-all duration-300`}
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            {availableTags.filter(tag => tag.isClass && tag.class === 'X').map((classTag, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedTags = [...availableTags];
                                                        updatedTags.forEach((tag, i) => {
                                                            if (tag.isClass && tag.name !== classTag.name) {
                                                                updatedTags[i].selected = false;
                                                            }
                                                        });
                                                        const tagIndex = availableTags.findIndex(t => t.name === classTag.name);
                                                        updatedTags[tagIndex].selected = !updatedTags[tagIndex].selected;
                                                        setAvailableTags(updatedTags);
                                                        
                                                        let newTags = tags.filter(t => !availableTags.find(at => at.name === t.name && at.isClass));
                                                        if (updatedTags[tagIndex].selected) {
                                                            newTags.push({ name: updatedTags[tagIndex].name, class: true });
                                                        }
                                                        setTags(newTags);
                                                    }}
                                                    className={`px-4 py-2 rounded-full border font-bold text-lg ${
                                                        classTag.selected
                                                            ? 'bg-green-600 text-white border-green-600 shadow-lg'
                                                            : 'bg-bgCustomCard text-textCustomPrimary border-borderCustom hover:bg-bgCustomCardHover hover:border-green-400'
                                                    } transition-all duration-300`}
                                                >
                                                    {classTag.name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableTags.filter(tag => !tag.isClass && tag.class === 'X').map((tag, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedTags = [...availableTags];
                                                        const tagIndex = availableTags.findIndex(t => t.name === tag.name);
                                                        updatedTags[tagIndex].selected = !updatedTags[tagIndex].selected;
                                                        setAvailableTags(updatedTags);
                                                        if (updatedTags[tagIndex].selected) {
                                                            setTags([...tags, { name: updatedTags[tagIndex].name, class: false }]);
                                                        } else {
                                                            setTags(tags.filter(t => t.name !== updatedTags[tagIndex].name));
                                                        }
                                                    }}
                                                    className={`px-3 py-2 rounded-full border text-sm ${
                                                        tag.selected
                                                            ? 'bg-primaryCustom text-white border-primaryCustom shadow-lg'
                                                            : 'bg-bgCustomCard text-textCustomPrimary border-borderCustom hover:bg-bgCustomCardHover hover:border-primaryCustom/50'
                                                    } transition-all duration-300`}
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            {availableTags.filter(tag => tag.isClass && tag.class === 'XI').map((classTag, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedTags = [...availableTags];
                                                        updatedTags.forEach((tag, i) => {
                                                            if (tag.isClass && tag.name !== classTag.name) {
                                                                updatedTags[i].selected = false;
                                                            }
                                                        });
                                                        const tagIndex = availableTags.findIndex(t => t.name === classTag.name);
                                                        updatedTags[tagIndex].selected = !updatedTags[tagIndex].selected;
                                                        setAvailableTags(updatedTags);
                                                        
                                                        let newTags = tags.filter(t => !availableTags.find(at => at.name === t.name && at.isClass));
                                                        if (updatedTags[tagIndex].selected) {
                                                            newTags.push({ name: updatedTags[tagIndex].name, class: true });
                                                        }
                                                        setTags(newTags);
                                                    }}
                                                    className={`px-4 py-2 rounded-full border font-bold text-lg ${
                                                        classTag.selected
                                                            ? 'bg-green-600 text-white border-green-600 shadow-lg'
                                                            : 'bg-bgCustomCard text-textCustomPrimary border-borderCustom hover:bg-bgCustomCardHover hover:border-green-400'
                                                    } transition-all duration-300`}
                                                >
                                                    {classTag.name}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableTags.filter(tag => !tag.isClass && tag.class === 'XI').map((tag, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedTags = [...availableTags];
                                                        const tagIndex = availableTags.findIndex(t => t.name === tag.name);
                                                        updatedTags[tagIndex].selected = !updatedTags[tagIndex].selected;
                                                        setAvailableTags(updatedTags);
                                                        if (updatedTags[tagIndex].selected) {
                                                            setTags([...tags, { name: updatedTags[tagIndex].name, class: false }]);
                                                        } else {
                                                            setTags(tags.filter(t => t.name !== updatedTags[tagIndex].name));
                                                        }
                                                    }}
                                                    className={`px-3 py-2 rounded-full border text-sm ${
                                                        tag.selected
                                                            ? 'bg-primaryCustom text-white border-primaryCustom shadow-lg'
                                                            : 'bg-bgCustomCard text-textCustomPrimary border-borderCustom hover:bg-bgCustomCardHover hover:border-primaryCustom/50'
                                                    } transition-all duration-300`}
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-textCustomPrimary font-semibold mb-2">
                                    Problem Statement (Cerinta) *
                                </label>
                                <textarea
                                    value={cerinta}
                                    onChange={(e) => setCerinta(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300 resize-vertical"
                                    placeholder="Detailed problem statement and requirements..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Constraints (Restrictii)
                                    </label>
                                    <textarea
                                        value={Restrictii}
                                        onChange={(e) => setRestrictii(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300 resize-vertical"
                                        placeholder="Time/memory limits, input constraints..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Notes (Precizari)
                                    </label>
                                    <textarea
                                        value={Precizari}
                                        onChange={(e) => setPrecizari(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300 resize-vertical"
                                        placeholder="Additional clarifications..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Timeout (milliseconds)
                                    </label>
                                    <input
                                        type="number"
                                        value={timeout}
                                        onChange={(e) => setTimeout(Math.max(50, Math.min(20000, parseInt(e.target.value) || 5000)))}
                                        min="50"
                                        max="20000"
                                        step="25"
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300"
                                        placeholder="5000"
                                    />
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-textCustomMuted">
                                            Time limit before TIME_LIMIT_EXCEEDED
                                        </p>
                                        <p className="text-xs text-orange-400">
                                            Range: 0.05s - 20s (Default: 5s)
                                        </p>
                                        <p className="text-xs text-red-400">
                                            ⚠️ Timeout = 0 points for test case
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6 border-b border-borderCustom pb-3">
                                <h2 className="text-2xl font-bold text-textCustomPrimary">
                                    Examples & Test Cases
                                </h2>
                                {showStep2ValidationError && (
                                    (!DateDeIntrare.trim() || !DateDeIesire.trim() || 
                                    Exemple.length < 1 || Teste.length < 4 ||
                                    Exemple.some(ex => !ex.input.trim() || !ex.output.trim()) ||
                                    Teste.some(test => !test.input.trim() || !test.output.trim())) && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                                            <div className="text-red-400 text-sm font-medium">
                                                Missing: {[
                                                    !DateDeIntrare.trim() && 'Input Format',
                                                    !DateDeIesire.trim() && 'Output Format',
                                                    Exemple.length < 1 && 'Examples (min 1)',
                                                    Teste.length < 4 && `Test Cases (${Teste.length}/4 min)`,
                                                    Exemple.some(ex => !ex.input.trim() || !ex.output.trim()) && 'Complete Examples',
                                                    Teste.some(test => !test.input.trim() || !test.output.trim()) && 'Complete Test Cases'
                                                ].filter(Boolean).join(', ')}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Input Format (Date de Intrare) *
                                    </label>
                                    <textarea
                                        value={DateDeIntrare}
                                        onChange={(e) => setDateDeIntrare(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300 resize-vertical"
                                        placeholder="Describe the input format..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-textCustomPrimary font-semibold mb-2">
                                        Output Format (Date de Iesire) *
                                    </label>
                                    <textarea
                                        value={DateDeIesire}
                                        onChange={(e) => setDateDeIesire(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_8px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(239,68,68,0.2)] focus:outline-none focus:border-primaryCustom focus:shadow-[0_8px_20px_rgba(239,68,68,0.4)] transition-all duration-300 resize-vertical"
                                        placeholder="Describe the output format..."
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-textCustomPrimary font-semibold">
                                        Examples (Exemple) [min 1] *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if(Exemple.length >= 2) {
                                                return;
                                            }
                                            setExemple([...Exemple, { input: '', output: '', explanation: '' }]);
                                        }}
                                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                            Exemple.length >= 2 
                                                ? 'bg-gray-500 cursor-not-allowed text-gray-300' 
                                                : 'bg-primaryCustom hover:bg-primaryCustomHover text-white'
                                        }`}
                                        disabled={Exemple.length >= 2}
                                    >
                                        + Add Example {Exemple.length >= 2 && '(Max 2)'}
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    {Exemple.length === 0 ? (
                                        <div className="text-center py-8 bg-bgCustomLight/50 rounded-lg border-2 border-dashed border-borderCustom">
                                            <p className="text-textCustomMuted mb-3">No examples added yet</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if(Exemple.length >= 2) {
                                                        return;
                                                    }
                                                    setExemple([{ input: '', output: '', explanation: '' }]);
                                                }}
                                                className="px-4 py-2 bg-primaryCustom hover:bg-primaryCustomHover text-white rounded-lg transition-colors text-sm"
                                            >
                                                Add First Example
                                            </button>
                                        </div>
                                    ) : (
                                        Exemple.map((example, index) => (
                                            <div key={index} className="bg-bgCustomLight/30 rounded-lg p-4 border border-borderCustom">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-textCustomPrimary">Example {index + 1}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => setExemple(Exemple.filter((_, i) => i !== index))}
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-textCustomSecondary text-sm mb-2">Input</label>
                                                        <textarea
                                                            value={example.input}
                                                            onChange={(e) => {
                                                                const newExamples = [...Exemple];
                                                                newExamples[index].input = e.target.value;
                                                                setExemple(newExamples);
                                                            }}
                                                            rows={3}
                                                            className="w-full px-3 py-2 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_4px_8px_rgba(0,0,0,0.2)] focus:outline-none focus:border-primaryCustom transition-all duration-300 resize-vertical text-sm font-mono"
                                                            placeholder="Example input..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-textCustomSecondary text-sm mb-2">Output</label>
                                                        <textarea
                                                            value={example.output}
                                                            onChange={(e) => {
                                                                const newExamples = [...Exemple];
                                                                newExamples[index].output = e.target.value;
                                                                setExemple(newExamples);
                                                            }}
                                                            rows={3}
                                                            className="w-full px-3 py-2 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_4px_8px_rgba(0,0,0,0.2)] focus:outline-none focus:border-primaryCustom transition-all duration-300 resize-vertical text-sm font-mono"
                                                            placeholder="Expected output..."
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-textCustomSecondary text-sm mb-2">Explanation (Optional)</label>
                                                    <textarea
                                                        value={example.explanation}
                                                        onChange={(e) => {
                                                            const newExamples = [...Exemple];
                                                            newExamples[index].explanation = e.target.value;
                                                            setExemple(newExamples);
                                                        }}
                                                        rows={2}
                                                        className="w-full px-3 py-2 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-primaryCustom/30 rounded-lg text-textCustomPrimary shadow-[0_4px_8px_rgba(0,0,0,0.2)] focus:outline-none focus:border-primaryCustom transition-all duration-300 resize-vertical text-sm"
                                                        placeholder="Explain how the output is derived..."
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-textCustomPrimary font-semibold">
                                        Test Cases (Teste) [min 4] *
                                    </label>
                                    <div className="flex gap-2">
                                        {Teste.length > 3 && (
                                            <button
                                                type="button"
                                                onClick={() => setTeste([])}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                            >
                                                🗑️ Remove All
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if(Teste.length >= 25) {
                                                    return;
                                                }
                                                setTeste([...Teste, { input: '', output: '' }]);
                                            }}
                                            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                                Teste.length >= 25 
                                                    ? 'bg-gray-500 cursor-not-allowed text-gray-300' 
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                            disabled={Teste.length >= 25}
                                        >
                                            + Add Test Case {Teste.length >= 25 && '(Max 25)'}
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {Teste.length === 0 ? (
                                        <div className="text-center py-8 bg-bgCustomLight/50 rounded-lg border-2 border-dashed border-borderCustom">
                                            <p className="text-textCustomMuted mb-3">No test cases added yet</p>
                                            <button
                                                type="button"
                                                onClick={() => setTeste([{ input: '', output: '' }])}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                                            >
                                                Add First Test Case
                                            </button>
                                        </div>
                                    ) : (
                                        Teste.map((test, index) => (
                                            <div key={index} className="bg-green-900/10 rounded-lg p-4 border border-green-500/30">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-textCustomPrimary">Test Case {index + 1}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => setTeste(Teste.filter((_, i) => i !== index))}
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-textCustomSecondary text-sm mb-2">Input</label>
                                                        <textarea
                                                            value={test.input}
                                                            onChange={(e) => {
                                                                const newTests = [...Teste];
                                                                newTests[index].input = e.target.value;
                                                                setTeste(newTests);
                                                            }}
                                                            rows={4}
                                                            className="w-full px-3 py-2 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-green-500/30 rounded-lg text-textCustomPrimary shadow-[0_4px_8px_rgba(0,0,0,0.2)] focus:outline-none focus:border-green-500 transition-all duration-300 resize-vertical text-sm font-mono"
                                                            placeholder="Test input..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-textCustomSecondary text-sm mb-2">Expected Output</label>
                                                        <textarea
                                                            value={test.output}
                                                            onChange={(e) => {
                                                                const newTests = [...Teste];
                                                                newTests[index].output = e.target.value;
                                                                setTeste(newTests);
                                                            }}
                                                            rows={4}
                                                            className="w-full px-3 py-2 bg-gradient-to-br from-bgCustomCard to-bgCustomLight border border-green-500/30 rounded-lg text-textCustomPrimary shadow-[0_4px_8px_rgba(0,0,0,0.2)] focus:outline-none focus:border-green-500 transition-all duration-300 resize-vertical text-sm font-mono"
                                                            placeholder="Expected output..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-borderCustom pt-6 sm:pt-8'>
                    <div className="order-2 sm:order-1">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentStep(prev => prev - 1);
                                    setShowStep2ValidationError(false);
                                }}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-bgCustomLight border border-borderCustom text-textCustomPrimary rounded-lg hover:bg-bgCustomCardHover transition-colors text-sm sm:text-base"
                            >
                                ← Previous
                            </button>
                        )}
                    </div>
                    
                    <div className="order-1 sm:order-2 text-center">
                        <div className="text-xs sm:text-sm text-textCustomMuted mb-2">
                            Step {currentStep} of {steps.length}
                        </div>
                    </div>

                    <div className="order-3 w-full sm:w-auto">
                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={() =>{
                                    if(currentStep === 1){
                                        if(!title.trim() || !description.trim() || !difficulty || tags.length === 0 || !cerinta.trim()){
                                            setShowValidationError(true);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            return;
                                        }
                                        setCurrentStep(2);
                                        setShowValidationError(false);
                                    }else{
                                        handleSubmit();
                                    }
                                }}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primaryCustom hover:bg-primaryCustomHover disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    const step2Invalid = !DateDeIntrare.trim() || !DateDeIesire.trim() || 
                                        Exemple.length < 1 || Teste.length < 4 ||
                                        Exemple.some(ex => !ex.input.trim() || !ex.output.trim()) ||
                                        Teste.some(test => !test.input.trim() || !test.output.trim());
                                    
                                    if (step2Invalid) {
                                        setShowStep2ValidationError(true);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        return;
                                    }
                                    
                                    handleSubmit();
                                }}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium sm:font-semibold transition-colors min-w-full sm:min-w-[160px] text-sm sm:text-base"
                            >
                                {isLoading ? ' Creating...' : ' Create Problem'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default CreateProblem;