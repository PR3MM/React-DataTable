import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';

interface Artwork {
    id: number;
    title: string;
    placeOfOrigin: string;
    artist: string;
    inscriptions: string;
    startDate: number;
    endDate: number;
}

export default function ArtworkTable() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [customRows, setCustomRows] = useState<number>(12); 
    const toast = useRef<Toast>(null);
    const overlayPanel = useRef<OverlayPanel>(null);

    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        setRowsPerPage(event.rows);
    };

    useEffect(() => {
        fetch(`https://api.artic.edu/api/v1/artworks?page=${first + 1}`)
            .then((response) => response.json())
            .then((data) => {
                const fetchedArtworks = data.data.map((artwork: any) => ({
                    id: artwork.id,
                    title: artwork.title || 'N/A',
                    placeOfOrigin: artwork.place_of_origin || 'Unknown',
                    artist: artwork.artist_display || 'Unknown',
                    inscriptions: artwork.inscriptions || 'N/A',
                    startDate: artwork.date_start || 0,
                    endDate: artwork.date_end || 0,
                }));
                setArtworks(fetchedArtworks);
                
                if (isSelectAll) {
                    setSelectedArtworks((prevSelected) => {
                        const selectedIds = new Set(prevSelected.map((a) => a.id));
                        const newSelections = fetchedArtworks.filter((a: Artwork) => !selectedIds.has(a.id));
                        return [...prevSelected, ...newSelections];
                    });
                }
            })
            .catch((error) => console.error('Error fetching artworks:', error));
    }, [first, rowsPerPage, isSelectAll]);

    const handleSelectionChange = (e: { value: Artwork[] }) => {
        const updatedSelection = e.value;
        setSelectedArtworks(updatedSelection);
        
        const allSelected = artworks.every((artwork) => 
            updatedSelection.some((selected: Artwork) => selected.id === artwork.id)
        );
        setIsSelectAll(allSelected);
    };

    const handleHeaderCheckboxChange = (checked: boolean) => {
        setIsSelectAll(checked);
        if (checked) {
            setSelectedArtworks((prevSelected) => {
                const selectedIds = new Set(prevSelected.map((a) => a.id));
                const newSelections = artworks.filter((a) => !selectedIds.has(a.id));
                return [...prevSelected, ...newSelections];
            });
        } else {
            setSelectedArtworks([]);
        }
    };

    const selectionHeaderTemplate = () => (
        <div className="flex items-center gap-2">
            <button 
                onClick={(e) => overlayPanel.current?.toggle(e)}
                className="p-button p-button-rounded p-button-text p-button-outlined flex items-center gap-2"
            >
                <i className="pi pi-chevron-down text-gray-600 text-lg"></i>
                <span className="text-sm font-medium text-gray-800"></span>
            </button>
        </div>
    );

    const handleRowSelection = () => {
        const selectedCount = Math.min(customRows, artworks.length);
        const selectedArtworksSlice = artworks.slice(0, selectedCount);
        setSelectedArtworks(selectedArtworksSlice); 
        // setIsOverlayVisible(true); 
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable 
                value={artworks} 
                selectionMode="multiple" 
                selection={selectedArtworks}
                onSelectionChange={handleSelectionChange}
                dataKey="id" 
                tableStyle={{ minWidth: '70rem' }}
                selectAll={isSelectAll}
                onSelectAllChange={(e) => handleHeaderCheckboxChange(e.checked)}
            >
                <Column 
                    selectionMode="multiple" 
                    headerStyle={{ width: '3rem' }} 
                />
                <Column header={selectionHeaderTemplate} />
                <Column field="title" header="Title" />
                <Column field="placeOfOrigin" header="Place of Origin" />
                <Column field="artist" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="startDate" header="Start Date" />
                <Column field="endDate" header="End Date" />
            </DataTable>

            <OverlayPanel ref={overlayPanel}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="rows">Enter number of rows to select:</label>
                        <input 
                            id="rows" 
                            type="number" 
                            value={customRows} 
                            onChange={(e) => setCustomRows(Number(e.target.value))} 
                            min={1} 
                            className="p-inputtext p-component"
                        />
                    </div>
                    <Button label="Select Rows" onClick={handleRowSelection} />
                </div>
            </OverlayPanel>

            <Paginator 
                first={first} 
                rows={rowsPerPage} 
                totalRecords={120} 
                rowsPerPageOptions={[10, 20, 30]} 
                onPageChange={handlePageChange} 
            />
        </div>
    );
}
