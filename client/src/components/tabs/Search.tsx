interface SearchProps {
  setCurrentTab: (tab: string) => void;
}

const Search: React.FC<SearchProps> = ({ setCurrentTab }) => {
  setCurrentTab("search");
  return (
    <div>Search</div>
  )
}

export default Search;