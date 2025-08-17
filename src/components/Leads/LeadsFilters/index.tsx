interface UrlParams {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface LeadsFiltersProps {
  filters: UrlParams;
  onFiltersChange: (newParams: Partial<UrlParams>) => void;
}

export function LeadsFilters({ filters, onFiltersChange }: LeadsFiltersProps) {
  const { search, status, sortBy, sortOrder } = filters;
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Buscar por nome, empresa ou email..."
            value={search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-40">
          <select
            value={status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="new">Novo</option>
            <option value="contacted">Contatado</option>
            <option value="qualified">Qualificado</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="min-w-32">
          <select
            value={sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="score">Score</option>
            <option value="name">Nome</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="min-w-32">
          <select
            value={sortOrder}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>
    </div>
  );
}
