import React, { useState, useEffect } from 'react';
import { api } from '@/components/api/apiClient';
import JsonViewer from '@/components/common/JsonViewer';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Send,
	Clock,
	Trash2,
	ChevronRight,
	Play,
	FileJson
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const BET_TYPES = ['WIN', 'PLACE', 'SHOW', 'EXACTA'];
const COMBO_TYPES = ['BOX', 'STRAIGHT', 'WHEEL'];

function BettingTab() {
	const [betType, setBetType] = useState('WIN');
	const [trackCode, setTrackCode] = useState('');
	const [raceNumber, setRaceNumber] = useState('');
	const [horseNumber, setHorseNumber] = useState('');
	const [betCombination, setBetCombination] = useState('');
	const [betAmount, setBetAmount] = useState('');
	const [comboType, setComboType] = useState('STRAIGHT');
	const [isLoading, setIsLoading] = useState(false);
	const [request, setRequest] = useState(null);
	const [response, setResponse] = useState(null);

	const buildPayload = () => {
		const payload = {
			betType,
			trackCode,
			raceNumber: parseInt(raceNumber),
			amount: parseFloat(betAmount),
		};

		if (betType === 'EXACTA') {
			payload.combination = betCombination.split(',').map(n => n.trim());
			payload.comboType = comboType;
		} else {
			payload.horseNumber = parseInt(horseNumber);
		}

		return payload;
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		const payload = buildPayload();
		setRequest(payload);
		setResponse(null);

		try {
			const data = await api.post('/api/submit-bets', payload);
			setResponse({ success: true, data });
		} catch (error) {
			setResponse({ success: false, error: error.message, data: error.data });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Bet Configuration</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Bet Type</Label>
							<Select value={betType} onValueChange={setBetType}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{BET_TYPES.map(type => (
										<SelectItem key={type} value={type}>{type}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Track Code</Label>
							<Input
								value={trackCode}
								onChange={(e) => setTrackCode(e.target.value)}
								placeholder="e.g., SA"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Race Number</Label>
							<Input
								type="number"
								value={raceNumber}
								onChange={(e) => setRaceNumber(e.target.value)}
								placeholder="e.g., 5"
							/>
						</div>
						<div>
							<Label>Bet Amount ($)</Label>
							<Input
								type="number"
								step="0.01"
								value={betAmount}
								onChange={(e) => setBetAmount(e.target.value)}
								placeholder="e.g., 10.00"
							/>
						</div>
					</div>

					{betType === 'EXACTA' ? (
						<>
							<div>
								<Label>Bet Combination (comma-separated)</Label>
								<Input
									value={betCombination}
									onChange={(e) => setBetCombination(e.target.value)}
									placeholder="e.g., 1, 4, 7"
								/>
							</div>
							<div>
								<Label>Combo Type</Label>
								<Select value={comboType} onValueChange={setComboType}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{COMBO_TYPES.map(type => (
											<SelectItem key={type} value={type}>{type}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</>
					) : (
						<div>
							<Label>Horse Number</Label>
							<Input
								type="number"
								value={horseNumber}
								onChange={(e) => setHorseNumber(e.target.value)}
								placeholder="e.g., 3"
							/>
						</div>
					)}

					<Button
						onClick={handleSubmit}
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700"
					>
						<Send className="w-4 h-4 mr-2" />
						Submit Bet
					</Button>
				</CardContent>
			</Card>

			<div className="space-y-4">
				{request && (
					<JsonViewer data={request} title="Request Payload" />
				)}
				{response && (
					<JsonViewer
						data={response}
						title={`Response ${response.success ? '✓' : '✗'}`}
					/>
				)}
			</div>
		</div>
	);
}

function RaceDataTab() {
	const [jsonPayload, setJsonPayload] = useState('{\n  "date": "2024-01-15",\n  "track": "SA"\n}');
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [jsonError, setJsonError] = useState('');

	const validateJson = (text) => {
		try {
			JSON.parse(text);
			setJsonError('');
			return true;
		} catch (e) {
			setJsonError(e.message);
			return false;
		}
	};

	const handleSubmit = async () => {
		if (!validateJson(jsonPayload)) {
			setJsonError('Invalid JSON payload');
			return;
		}

		setIsLoading(true);
		setResponse(null);

		try {
			const data = await api.post('/api/races/daily', JSON.parse(jsonPayload));
			setResponse({ success: true, data });
		} catch (error) {
			setResponse({ success: false, error: error.message, data: error.data });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Race Data Payload</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label>JSON Payload</Label>
						<Textarea
							value={jsonPayload}
							onChange={(e) => {
								setJsonPayload(e.target.value);
								validateJson(e.target.value);
							}}
							className="font-mono text-sm h-64"
							placeholder="Enter JSON payload..."
						/>
						{jsonError && (
							<p className="text-sm text-rose-500 mt-2">{jsonError}</p>
						)}
					</div>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !!jsonError}
						className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700"
					>
						<Send className="w-4 h-4 mr-2" />
						Send Race Data
					</Button>
				</CardContent>
			</Card>

			<div>
				{response && (
					<JsonViewer
						data={response}
						title={`Response ${response.success ? '✓' : '✗'}`}
					/>
				)}
			</div>
		</div>
	);
}

function QueryTab() {
	const [selectedEndpoint, setSelectedEndpoint] = useState('races');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [trackId, setTrackId] = useState('');
	const [trackCode, setTrackCode] = useState('');
	const [date, setDate] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [builtUrl, setBuiltUrl] = useState('');

	const endpoints = [
		{ id: 'races', label: 'Get Races', path: '/api/races', params: ['startDate', 'endDate'] },
		{ id: 'winners', label: 'Get Winners', path: '/api/races/winners', params: ['startDate', 'endDate'] },
		{ id: 'winnersTrack', label: 'Winners by Track', path: '/api/races/winners/track/:trackId', params: ['trackId'] },
		{ id: 'entriesDaily', label: 'Daily Entries', path: '/api/races/entries/daily', params: ['date', 'trackCode'] },
		{ id: 'tracks', label: 'Get Tracks', path: '/api/races/tracks', params: [] },
	];

	useEffect(() => {
		const endpoint = endpoints.find(e => e.id === selectedEndpoint);
		if (endpoint) {
			let url = endpoint.path;
			const params = new URLSearchParams();

			if (endpoint.params.includes('startDate') && startDate) params.append('startDate', startDate);
			if (endpoint.params.includes('endDate') && endDate) params.append('endDate', endDate);
			if (endpoint.params.includes('trackId') && trackId) url = url.replace(':trackId', trackId);
			if (endpoint.params.includes('date') && date) params.append('date', date);
			if (endpoint.params.includes('trackCode') && trackCode) params.append('trackCode', trackCode);

			const queryString = params.toString();
			setBuiltUrl(queryString ? `${url}?${queryString}` : url);
		}
	}, [selectedEndpoint, startDate, endDate, trackId, trackCode, date]);

	const handleQuery = async () => {
		setIsLoading(true);
		setResponse(null);

		try {
			const data = await api.get(builtUrl);
			setResponse({ success: true, data });
		} catch (error) {
			setResponse({ success: false, error: error.message, data: error.data });
		} finally {
			setIsLoading(false);
		}
	};

	const endpoint = endpoints.find(e => e.id === selectedEndpoint);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Query Configuration</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label>Endpoint</Label>
						<Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{endpoints.map(ep => (
									<SelectItem key={ep.id} value={ep.id}>{ep.label}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{endpoint?.params.includes('startDate') && (
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Start Date</Label>
								<Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
							</div>
							<div>
								<Label>End Date</Label>
								<Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
							</div>
						</div>
					)}

					{endpoint?.params.includes('trackId') && (
						<div>
							<Label>Track ID</Label>
							<Input value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="Enter track ID" />
						</div>
					)}

					{endpoint?.params.includes('date') && (
						<div>
							<Label>Date</Label>
							<Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
						</div>
					)}

					{endpoint?.params.includes('trackCode') && (
						<div>
							<Label>Track Code</Label>
							<Input value={trackCode} onChange={(e) => setTrackCode(e.target.value)} placeholder="e.g., SA" />
						</div>
					)}

					<div className="p-3 rounded-lg bg-slate-100 font-mono text-sm break-all">
						<span className="text-slate-500">GET</span> {builtUrl}
					</div>

					<Button
						onClick={handleQuery}
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700"
					>
						<Play className="w-4 h-4 mr-2" />
						Execute Query
					</Button>
				</CardContent>
			</Card>

			<div>
				{response && (
					<JsonViewer
						data={response}
						title={`Response ${response.success ? '✓' : '✗'}`}
					/>
				)}
			</div>
		</div>
	);
}

function RequestHistory({ history, onSelect, onClear }) {
	if (history.length === 0) {
		return (
			<div className="text-center py-8 text-slate-400">
				<Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
				<p className="text-sm">No request history</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between mb-3">
				<p className="text-sm font-medium text-slate-600">Recent Requests</p>
				<Button variant="ghost" size="sm" onClick={onClear}>
					<Trash2 className="w-4 h-4" />
				</Button>
			</div>
			<ScrollArea className="h-64">
				{history.map((item, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
						onClick={() => onSelect(item)}
					>
						<Badge variant={item.method === 'GET' ? 'secondary' : 'default'} className="text-xs">
							{item.method}
						</Badge>
						<span className="text-sm text-slate-600 truncate flex-1">{item.path}</span>
						<span className="text-xs text-slate-400">
							{new Date(item.timestamp).toLocaleTimeString()}
						</span>
						<ChevronRight className="w-4 h-4 text-slate-400" />
					</motion.div>
				))}
			</ScrollArea>
		</div>
	);
}

export default function ApiTest() {
	const [history, setHistory] = useState([]);

	useEffect(() => {
		const saved = localStorage.getItem('api_test_history');
		if (saved) {
			try {
				setHistory(JSON.parse(saved));
			} catch (e) { }
		}
	}, []);

	const addToHistory = (item) => {
		const newHistory = [{ ...item, timestamp: new Date().toISOString() }, ...history].slice(0, 20);
		setHistory(newHistory);
		localStorage.setItem('api_test_history', JSON.stringify(newHistory));
	};

	const clearHistory = () => {
		setHistory([]);
		localStorage.removeItem('api_test_history');
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-2xl font-bold text-slate-800">API Test Console</h2>
				<p className="text-slate-500 text-sm mt-1">
					Test and debug API endpoints
				</p>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				{/* Main Content */}
				<div className="xl:col-span-3">
					<Tabs defaultValue="betting" className="space-y-6">
						<TabsList className="bg-slate-100">
							<TabsTrigger value="betting">Betting</TabsTrigger>
							<TabsTrigger value="raceData">Race Data</TabsTrigger>
							<TabsTrigger value="query">Query</TabsTrigger>
						</TabsList>

						<TabsContent value="betting">
							<BettingTab />
						</TabsContent>
						<TabsContent value="raceData">
							<RaceDataTab />
						</TabsContent>
						<TabsContent value="query">
							<QueryTab />
						</TabsContent>
					</Tabs>
				</div>

				{/* History Sidebar */}
				<div className="xl:col-span-1">
					<Card>
						<CardContent className="p-4">
							<RequestHistory
								history={history}
								onSelect={(item) => console.log('Selected:', item)}
								onClear={clearHistory}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}