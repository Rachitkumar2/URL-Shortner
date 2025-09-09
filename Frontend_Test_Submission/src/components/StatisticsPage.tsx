'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { ShortenedUrl, ClickRecord } from '@/types/url';
import { urlService } from '@/services/urlService';
import { logger } from '@/middleware/logger';

export default function StatisticsPage() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadUrls = () => {
    const allUrls = urlService.getAllUrls();
    setUrls(allUrls);
    logger.info('StatisticsPage.loadUrls', 'frontend', `Loaded ${allUrls.length} URLs for statistics`, { count: allUrls.length });
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDateShort = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      logger.info('StatisticsPage.copyToClipboard', 'frontend', 'URL copied to clipboard', { url: text });
    } catch (error) {
      logger.error('StatisticsPage.copyToClipboard', 'frontend', 'Failed to copy URL to clipboard', { error });
    }
  };

  const handleDelete = (shortCode: string) => {
    if (confirm('Are you sure you want to delete this shortened URL?')) {
      urlService.deleteUrl(shortCode);
      loadUrls();
      logger.info('StatisticsPage.handleDelete', 'frontend', 'URL deleted from statistics', { shortCode });
    }
  };

  const handleViewDetails = (url: ShortenedUrl) => {
    setSelectedUrl(url);
    setDetailsOpen(true);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all shortened URLs? This action cannot be undone.')) {
      urlService.clearAllUrls();
      loadUrls();
      logger.info('StatisticsPage.handleClearAll', 'frontend', 'All URLs cleared from statistics');
    }
  };

  const getStatusChip = (url: ShortenedUrl) => {
    if (url.isExpired) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clicks.length, 0);
  };

  const getActiveUrls = () => {
    return urls.filter(url => !url.isExpired).length;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon color="primary" />
          URL Statistics
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUrls}
          >
            Refresh
          </Button>
          {urls.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total URLs
            </Typography>
            <Typography variant="h4">
              {urls.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main">
              Active URLs
            </Typography>
            <Typography variant="h4">
              {getActiveUrls()}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="info.main">
              Total Clicks
            </Typography>
            <Typography variant="h4">
              {getTotalClicks()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {urls.length === 0 ? (
        <Alert severity="info">
          No shortened URLs found. Create some URLs to see statistics here.
        </Alert>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.shortCode}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            /{url.shortCode}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(`http://localhost:3000/${url.shortCode}`)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(url)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateShort(url.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateShort(url.expiryDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {url.clicks.length}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(url)}
                            title="View Details"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(url.shortCode)}
                            title="Delete"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* URL Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          URL Details - /{selectedUrl?.shortCode}
        </DialogTitle>
        <DialogContent>
          {selectedUrl && (
            <Box sx={{ space: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Original URL:
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all', mb: 1 }}>
                    {selectedUrl.originalUrl}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Short URL:
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 1 }}>
                    http://localhost:3000/{selectedUrl.shortCode}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    {getStatusChip(selectedUrl)}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formatDate(selectedUrl.createdAt)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Expires:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {formatDate(selectedUrl.expiryDate)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Total Clicks:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedUrl.clicks.length}
                  </Typography>
                </Box>
              </Box>

              {selectedUrl.clicks.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      Click History ({selectedUrl.clicks.length} clicks)
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell>User Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedUrl.clicks
                            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                            .map((click) => (
                              <TableRow key={click.id}>
                                <TableCell>
                                  {formatDate(click.timestamp)}
                                </TableCell>
                                <TableCell>{click.source}</TableCell>
                                <TableCell>{click.userLocation}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
