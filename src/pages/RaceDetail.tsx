import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { api } from '@/components/api/apiClient';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import JsonViewer from '@/components/common/JsonViewer';
import { motion } from 'framer-motion';
import {
	ArrowLeft,
	Trophy,
	Calendar,
	MapPin,
	Hash,
	Award,
	RefreshCw,
	Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { RaceDetailResponse, RaceWinnerResponse, Race, RaceEntry, RaceWinner } from '@/types';

export default function RaceDetail() {
	const [race, setRace] = useState<(Race & { entries?: RaceEntry[] }) | null>(null);
	const [winner, setWinner] = useState<RaceWinner | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const urlParams = new URLSearchParams(window.location.search);
	const raceId = urlParams.get('id');

	const fetchRaceDetails = async () => {
		if (!raceId) {
			console.error('No race ID provided');
			return;
		}

		setIsLoading(true);
		try {
			const [raceResponse, winnerResponse] = await Promise.all([
				api.get<RaceDetailResponse>(`/api/races/${raceId}`),
				api.get<RaceWinnerResponse>(`/api/races/${raceId}/winner`).catch(() => null),
			]);

			if (raceResponse.success) {
				setRace({ ...raceResponse.race, entries: raceResponse.entries });
			}
			if (winnerResponse && winnerResponse.success) {
				setWinner(winnerResponse.winner);
			}
		} catch (error) {
			console.error('Failed to fetch race details:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchRaceDetails();
	}, [raceId]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<LoadingSpinner size="lg" text="Loading race details..." />
			</div>
		);
	}

	if (!race) {
		return (
			<div className="text-center py-12">
				<Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-slate-600 mb-2">Race Not Found</h3>
				<p className="text-sm text-slate-400 mb-4">
					The requested race could not be found
				</p>
				<Link to={createPageUrl('Races')}>
					<Button variant="outline">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Races
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Link to={createPageUrl('Races')}>
						<Button variant="ghost" size="icon">
							<ArrowLeft className="w-5 h-5" />
						</Button>
					</Link>
					<div>
						<h2 className="text-2xl font-bold text-slate-800">Race Details</h2>
						<p className="text-slate-500 text-sm mt-1">
							ID: <span className="font-mono">{raceId}</span>
						</p>
					</div>
				</div>
				<Button variant="outline" onClick={fetchRaceDetails} className="gap-2">
					<RefreshCw className="w-4 h-4" />
					Refresh
				</Button>
			</div>

			{/* Race Info Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0 }}
				>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-orange-100 text-orange-600">
									<MapPin className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-slate-500">Track</p>
									<p className="font-semibold text-slate-800">
										{race.trackCode || race.trackName || race.track_name || '—'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05 }}
				>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-blue-100 text-blue-600">
									<Hash className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-slate-500">Race Number</p>
									<p className="font-semibold text-slate-800">
										R{race.raceNumber || race.race_number || '—'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-purple-100 text-purple-600">
									<Calendar className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-slate-500">Date</p>
									<p className="font-semibold text-slate-800">
										{race.date ? new Date(race.date as string).toLocaleDateString() : '—'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
				>
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
									<Trophy className="w-5 h-5" />
								</div>
								<div>
									<p className="text-xs text-slate-500">Status</p>
									<Badge variant="outline" className={
										race.status === 'completed'
											? 'bg-emerald-100 text-emerald-700 border-emerald-200'
											: 'bg-amber-100 text-amber-700 border-amber-200'
									}>
										{race.status || 'Pending'}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Winner Info */}
			{winner && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Award className="w-5 h-5 text-amber-500" />
							Winner Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
								<p className="text-sm text-amber-600 mb-1">Winner</p>
								<p className="text-2xl font-bold text-amber-800">
									#{winner.winning_horse_number || winner.horseNumber || winner.winnerNumber || '—'}
								</p>
								{winner.horseName && (
									<p className="text-sm text-amber-600 mt-1">{winner.horseName}</p>
								)}
							</div>
							{(winner.winning_payout_2_dollar !== undefined || winner.payout) && (
								<div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
									<p className="text-sm text-slate-500 mb-1">Win Payout</p>
									<p className="text-2xl font-bold text-slate-800">
										${winner.winning_payout_2_dollar !== undefined
											? winner.winning_payout_2_dollar.toFixed(2)
											: (typeof winner.payout === 'number' ? winner.payout.toFixed(2) : winner.payout || '—')}
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Entries Table */}
			{race.entries && race.entries.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Users className="w-5 h-5 text-slate-500" />
							Race Entries
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="rounded-lg border border-slate-200 overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="bg-slate-50">
										<TableHead className="font-semibold">Horse #</TableHead>
										<TableHead className="font-semibold">Name</TableHead>
										<TableHead className="font-semibold">Odds</TableHead>
										<TableHead className="font-semibold">Jockey</TableHead>
										<TableHead className="font-semibold">Trainer</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{race.entries.map((entry: RaceEntry, index: number) => {
										const horseNum = entry.horse_number || entry.number || (entry as any).horseNumber || index + 1;
										const isWinner = winner && (winner.winning_horse_number === entry.horse_number || (winner as any).horseNumber === entry.number || (winner as any).winnerNumber === entry.number);
										return (
											<TableRow key={entry.id || index} className={isWinner ? 'bg-amber-50' : ''}>
												<TableCell>
													<Badge variant={isWinner ? 'default' : 'outline'} className={isWinner ? 'bg-amber-500' : ''}>
														#{horseNum}
													</Badge>
												</TableCell>
												<TableCell className="font-medium">{entry.name || (entry as any).horseName || '—'}</TableCell>
												<TableCell>{entry.odds || entry.ml || entry.live_odds || '—'}</TableCell>
												<TableCell>{entry.jockey || '—'}</TableCell>
												<TableCell>{entry.trainer || '—'}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Raw Data */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Raw Race Data</CardTitle>
				</CardHeader>
				<CardContent>
					<JsonViewer data={race} title="Race Data" />
				</CardContent>
			</Card>
		</div>
	);
}