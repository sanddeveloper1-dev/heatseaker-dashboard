import { useState } from 'react';
import { api } from '@/components/api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import JsonViewer from '@/components/common/JsonViewer';
import { FileText, Database, BookOpen, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentationState {
	swagger: boolean;
	schemas: boolean;
	readme: boolean;
}

export default function Documentation() {
	const [swaggerDoc, setSwaggerDoc] = useState<any>(null);
	const [schemas, setSchemas] = useState<any>(null);
	const [readme, setReadme] = useState<string | null>(null);
	const [loading, setLoading] = useState<DocumentationState>({ swagger: false, schemas: false, readme: false });
	const [customEndpoint, setCustomEndpoint] = useState('');

	const fetchSwaggerDocs = async (endpoint = '/swagger.json') => {
		setLoading(prev => ({ ...prev, swagger: true }));
		try {
			const data = await api.get(endpoint);
			setSwaggerDoc(data);
		} catch (error: any) {
			console.error('Failed to fetch Swagger docs:', error);
			setSwaggerDoc({ error: error.message || 'Failed to fetch Swagger documentation' });
		} finally {
			setLoading(prev => ({ ...prev, swagger: false }));
		}
	};

	const fetchSchemas = async (endpoint = '/api/schemas') => {
		setLoading(prev => ({ ...prev, schemas: true }));
		try {
			const data = await api.get(endpoint);
			setSchemas(data);
		} catch (error: any) {
			console.error('Failed to fetch schemas:', error);
			setSchemas({ error: error.message || 'Failed to fetch schemas' });
		} finally {
			setLoading(prev => ({ ...prev, schemas: false }));
		}
	};

	const fetchReadme = async (endpoint = '/api/docs/readme') => {
		setLoading(prev => ({ ...prev, readme: true }));
		try {
			const data = await api.get(endpoint);
			setReadme(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
		} catch (error: any) {
			console.error('Failed to fetch README:', error);
			setReadme(`Error: ${error.message || 'Failed to fetch README'}`);
		} finally {
			setLoading(prev => ({ ...prev, readme: false }));
		}
	};

	const downloadAsJson = (data: any, filename: string) => {
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h2 className="text-2xl font-bold text-slate-800">API Documentation</h2>
				<p className="text-slate-500 text-sm mt-1">
					Access Swagger docs, schemas, and README from your backend
				</p>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="swagger" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="swagger" className="gap-2">
						<FileText className="w-4 h-4" />
						Swagger/OpenAPI
					</TabsTrigger>
					<TabsTrigger value="schemas" className="gap-2">
						<Database className="w-4 h-4" />
						Schemas
					</TabsTrigger>
					<TabsTrigger value="readme" className="gap-2">
						<BookOpen className="w-4 h-4" />
						README
					</TabsTrigger>
				</TabsList>

				{/* Swagger Tab */}
				<TabsContent value="swagger" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-slate-700">
								Swagger/OpenAPI Documentation
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-3">
								<Input
									placeholder="/swagger.json or custom endpoint"
									value={customEndpoint}
									onChange={(e) => setCustomEndpoint(e.target.value)}
									className="flex-1"
								/>
								<Button
									onClick={() => fetchSwaggerDocs(customEndpoint || '/swagger.json')}
									disabled={loading.swagger}
									className="gap-2"
								>
									{loading.swagger ? (
										<RefreshCw className="w-4 h-4 animate-spin" />
									) : (
										<RefreshCw className="w-4 h-4" />
									)}
									Fetch
								</Button>
								{swaggerDoc && !swaggerDoc.error && (
									<Button
										variant="outline"
										onClick={() => downloadAsJson(swaggerDoc, 'swagger.json')}
										className="gap-2"
									>
										<Download className="w-4 h-4" />
										Download
									</Button>
								)}
							</div>

							{loading.swagger ? (
								<LoadingSpinner size="lg" text="Fetching Swagger documentation..." />
							) : swaggerDoc ? (
								swaggerDoc.error ? (
									<div className="p-4 rounded-lg bg-red-50 border border-red-200">
										<p className="text-red-700 text-sm">{swaggerDoc.error}</p>
									</div>
								) : (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
									>
										<JsonViewer data={swaggerDoc} title="Swagger Documentation" />
									</motion.div>
								)
							) : (
								<div className="p-8 text-center text-slate-400">
									<FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p>Click "Fetch" to load Swagger documentation</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Schemas Tab */}
				<TabsContent value="schemas" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-slate-700">
								Database Schemas
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-3">
								<Input
									placeholder="/api/schemas or custom endpoint"
									value={customEndpoint}
									onChange={(e) => setCustomEndpoint(e.target.value)}
									className="flex-1"
								/>
								<Button
									onClick={() => fetchSchemas(customEndpoint || '/api/schemas')}
									disabled={loading.schemas}
									className="gap-2"
								>
									{loading.schemas ? (
										<RefreshCw className="w-4 h-4 animate-spin" />
									) : (
										<RefreshCw className="w-4 h-4" />
									)}
									Fetch
								</Button>
								{schemas && !schemas.error && (
									<Button
										variant="outline"
										onClick={() => downloadAsJson(schemas, 'schemas.json')}
										className="gap-2"
									>
										<Download className="w-4 h-4" />
										Download
									</Button>
								)}
							</div>

							{loading.schemas ? (
								<LoadingSpinner size="lg" text="Fetching schemas..." />
							) : schemas ? (
								schemas.error ? (
									<div className="p-4 rounded-lg bg-red-50 border border-red-200">
										<p className="text-red-700 text-sm">{schemas.error}</p>
									</div>
								) : (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
									>
										<JsonViewer data={schemas} title="Database Schemas" />
									</motion.div>
								)
							) : (
								<div className="p-8 text-center text-slate-400">
									<Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p>Click "Fetch" to load database schemas</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* README Tab */}
				<TabsContent value="readme" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-slate-700">
								README Documentation
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-3">
								<Input
									placeholder="/api/docs/readme or custom endpoint"
									value={customEndpoint}
									onChange={(e) => setCustomEndpoint(e.target.value)}
									className="flex-1"
								/>
								<Button
									onClick={() => fetchReadme(customEndpoint || '/api/docs/readme')}
									disabled={loading.readme}
									className="gap-2"
								>
									{loading.readme ? (
										<RefreshCw className="w-4 h-4 animate-spin" />
									) : (
										<RefreshCw className="w-4 h-4" />
									)}
									Fetch
								</Button>
							</div>

							{loading.readme ? (
								<LoadingSpinner size="lg" text="Fetching README..." />
							) : readme ? (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<div className="p-6 rounded-xl border border-slate-200 bg-white">
										<pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 overflow-auto max-h-96">
											{readme}
										</pre>
									</div>
								</motion.div>
							) : (
								<div className="p-8 text-center text-slate-400">
									<BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
									<p>Click "Fetch" to load README documentation</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}