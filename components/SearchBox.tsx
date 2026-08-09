type SearchBoxProps = {
  defaultValue?: string;
};

export default function SearchBox({ defaultValue = "" }: SearchBoxProps) {
  return (
    <form action="/products" className="searchBox">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Cari obat, kategori, atau indikasi..."
        aria-label="Cari obat"
      />
      <button type="submit" aria-label="Cari">
        <span>⌕</span>
      </button>
    </form>
  );
}
