'use client';

import { useSearchParams } from 'next/navigation';

const useQuerySearch = (searchItem: string) => {
	const searchParams = useSearchParams();
	const searchvalue = searchParams?.get(searchItem) || null;
	return searchvalue;
};

export default useQuerySearch;
