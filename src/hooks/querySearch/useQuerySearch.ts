const useQuerySearch = (searchItem: string) => {
	const queryParams = new URLSearchParams(window.location.search);
	const searchvalue = queryParams.get(searchItem);
	return searchvalue;
};

export default useQuerySearch;
