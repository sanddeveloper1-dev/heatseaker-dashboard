import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { api } from '@/components/api/apiClient';
import DataTable from '@/components/common/DataTable';
import { motion } from 'framer-motion';
import {
	Search,
	Filter,
	RefreshCw,
	Trophy,
	Eye,
	Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { RacesResponse, TracksResponse, Race, Track } from '@/types';

export default function Races() {
	const [races, setRaces] = useState<Race[]>([]);
	const [tracks, setTracks] = useState<Track[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedTrack, setSelectedTrack] = useState('all');

	const fetchTracks = async () => {
		try {
			const data = await api.get<TracksResponse>('/api/races/tracks');
			setTracks(data.success ? data.tracks : []);
		} catch (error) {
			// Tracks endpoint might not exist yet
			setTracks([]);
		}
	};

	const fetchRaces = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams();
			if (startDate) params.append('startDate', startDate);
			if (endDate) params.append('endDate', endDate);
			if (selectedTrack && selectedTrack !== 'all') params.append('trackId', selectedTrack);

			const queryString = params.toString();
			const url = queryString ? `/api/races?${queryString}` : '/api/races';

			const data = await api.get<RacesResponse>(url);
			setRaces(data.success ? data.races : []);
		} catch (error) {
			console.error('Failed to fetch races:', error);
			setRaces([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTracks();
	}, []);

	useEffect(() => {
		fetchRaces();
	}, [startDate, endDate, selectedTrack]);

	const columns = [
		{
			header: 'Race ID',
			accessor: 'id',
			render: (value: any) => (
				<span className="font-mono text-sm text-slate-600">{value?.substring?.(0, 8) || value || '—'}...</span>
			)
		},
		{
			header: 'Date',
			accessor: 'date',
			render: (value: any) => value ? new Date(value as string).toLocaleDateString() : '—'
		},
		{
			header: 'Track',
			accessor: 'trackCode',
			render: (value: any, row: any) => {
				const trackCode = value || row.track_code || '';
				const trackName = row.trackName || row.track_name || '';
				return (
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
							{trackCode?.substring?.(0, 2) || '—'}
						</div>
						<span className="font-medium">{trackName || trackCode || '—'}</span>
					</div>
				);
			}
		},
		{
			header: 'Race #',
			accessor: 'raceNumber',
			render: (value: any, row: any) => (
				<Badge variant="outline" className="font-mono">
					R{value || row.race_number || '—'}
				</Badge>
			)
		},
		{
			header: 'Status',
			accessor: 'status',
			render: (value: any) => {
				const statusColors: Record<string, string> = {
					completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
					pending: 'bg-amber-100 text-amber-700 border-amber-200',
					cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
				};
				const color = statusColors[value?.toLowerCase?.()] || 'bg-slate-100 text-slate-700 border-slate-200';
				return (
					<Badge variant="outline" className={color}>
						{value || 'Pending'}
					</Badge>
				);
			}
		},
		{
			header: 'Actions',
			accessor: 'id',
			render: (value: any) => (
				<Link to={createPageUrl(`RaceDetail?id=${value}`)}>
					<Button variant="ghost" size="sm" className="gap-2">
						<Eye className="w-4 h-4" />
						View
					</Button>
				</Link>
			)
		},
	];

	const setDatePreset = (days: number) => {
		const end = new Date();
		const start = new Date();
		start.setDate(start.getDate() - days);
		setStartDate(start.toISOString().split('T')[0]);
		setEndDate(end.toISOString().split('T')[0]);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">Race Management</h2>
					<p className="text-slate-500 text-sm mt-1">
						View and manage race data
					</p>
				</div>
				<Button variant="outline" onClick={fetchRaces} className="gap-2">
					<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
					Refresh
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col lg:flex-row gap-4 items-end">
						{/* Date Range */}
						<div className="flex-1">
							<Label className="text-sm text-slate-600 mb-2 block">Start Date</Label>
							<Input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</div>
						<div className="flex-1">
							<Label className="text-sm text-slate-600 mb-2 block">End Date</Label>
							<Input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
							/>
						</div>

						{/* Track Filter */}
						<div className="flex-1">
							<Label className="text-sm text-slate-600 mb-2 block">Track</Label>
							<Select value={selectedTrack} onValueChange={setSelectedTrack}>
								<SelectTrigger>
									<SelectValue placeholder="All Tracks" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Tracks</SelectItem>
									{tracks.map((track: Track) => (
										<SelectItem key={track.id || track.code} value={String(track.id || track.code)}>
											{track.name || track.code}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Quick Date Presets */}
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => setDatePreset(0)}>
								Today
							</Button>
							<Button variant="outline" size="sm" onClick={() => setDatePreset(7)}>
								Last 7 days
							</Button>
							<Button variant="outline" size="sm" onClick={() => setDatePreset(30)}>
								Last 30 days
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Results */}
			{races.length === 0 && !isLoading ? (
				<Card>
					<CardContent className="py-12">
						<div className="text-center">
							<Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-slate-600 mb-2">No Races Found</h3>
							<p className="text-sm text-slate-400 mb-4">
								Try adjusting your filters or check back later
							</p>
							<Button variant="outline" onClick={() => {
								setStartDate('');
								setEndDate('');
								setSelectedTrack('all');
							}}>
								Clear Filters
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<DataTable
					columns={columns}
					data={races}
					isLoading={isLoading}
					emptyMessage="No races found for the selected filters"
					onRowClick={undefined}
					pagination={undefined}
				/>
			)}
		</div>
	);
}