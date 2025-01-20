import { useEffect, useState } from 'react';


interface Params {
	params: {
		_limit?: number | string
	}
}

interface ResponseData {
	title: string
	id: string
}

interface FetchData {
	data: ResponseData[]
	isLoading: boolean
	error: boolean
}

export const useFetch = (api: string) => {
	const [fetchData, setFetchData] = useState<FetchData>({
		data: [],
		isLoading: true,
		error: false,
	});
	const [urlParams, setUrlParams] = useState<string | URLSearchParams>("")


	function refetch(obj: Params) {
		const { params } = obj
		if (params) {
			const copyParams = {...params, _limit: String(params._limit)}
			setUrlParams(new URLSearchParams(copyParams))
		}
	}

	useEffect(() => {
		fetch(`${api}?${urlParams}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Сетевая ошибка: ' + response.statusText);
				  }
				  return response.json();
				})
			.then((res: ResponseData[]) =>
				setFetchData({
					data: res,
					error: false,
					isLoading: false,
				})
			)
			.catch((error) =>
			{
				setFetchData({
					data: [],
					error: true,
					isLoading: false
				})
			}
			);

	}, [urlParams]);


	return { ...fetchData, refetch };
};
