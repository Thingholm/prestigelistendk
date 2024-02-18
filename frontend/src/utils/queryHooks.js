"use client";

import { useQueryClient, useQuery, useQueries } from '@tanstack/react-query';
import { supabase } from './supabase';


export const useAlltimeRanking = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['alltimeRanking'], queryFn: async () => {
            let { data: alltimeRanking } = await supabase.from('alltimeRanking').select('*');
            return alltimeRanking;
        },
    })

    return query
}

export const useNationRanking = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['nationRanking'],
        queryFn: async () => {
            let { data: nationRanking } = await supabase
                .from('nationsRanking')
                .select('*');
            return nationRanking;
        },
    })

    return query
}

export const useResultsByRiderYear = (riders, years) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['results', riders, years],
        queryFn: async () => {
            let { data: results } = await supabase
                .from('results')
                .select('*')
                .in('year', years)
                .in('rider', riders);
            return results;
        },
        enabled: !!riders
    })

    return query
}

export const useGreatestSeasons = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['greatestSeasons'],
        queryFn: async () => {
            let { data: greatestSeasons } = await supabase
                .from('greatestSeasons')
                .select('*')
            return greatestSeasons;
        },
    })

    return query
}

export const usePointSystem = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['pointSystem'],
        queryFn: async () => {
            let { data: pointSystem } = await supabase
                .from('pointSystem')
                .select('*')
            return pointSystem
        },
    })

    return query
}

export const useThreeYearRanking = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['threeYearRanking'],
        queryFn: async () => {
            let { data: greatestPast3Years } = await supabase
                .from('greatestPast3Years')
                .select('*')
            return greatestPast3Years
        },
    })

    return query
}

export const useAlltimeEachYear = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['alltimeEachYear'],
        queryFn: async () => {
            let { data: alltimeTop10PerYear } = await supabase
                .from('alltimeTop10PerYear')
                .select('*');
            return alltimeTop10PerYear;
        }
    })

    return query
}

export const useAlltimeEachDecade = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['alltimeEachDecade'],
        queryFn: async () => {
            let { data: greatestByDecade } = await supabase
                .from('greatestByDecade')
                .select('*');
            return greatestByDecade;
        }
    })

    return query
}


export const useLatestResults = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['latestResults'],
        queryFn: async () => {
            let { data: results } = await supabase
                .from('results')
                .select('*')
                .eq('year', 2024)
                .order('raceDate', { ascending: false })
                .range(0, 100)
            return results;
        }
    })

    return query
}

export const useNationsAccRank = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['nationsAccRank'],
        queryFn: async () => {
            let { data: nationsAccRank } = await supabase
                .from('nationsAccRank')
                .select('*')
            return nationsAccRank;
        }
    })

    return query
}

export const useNationsAccRankByNation = (nation) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['nationsAccRank', nation],
        queryFn: async () => {
            let { data: nationsAccRank } = await supabase
                .from('nationsAccRank')
                .select('*')
                .eq("nation", nation)
            return nationsAccRank;
        }
    })

    return query
}

export const useResultsByRider = (rider) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['resultsByRider', rider],
        queryFn: async () => {
            let { data: results } = await supabase
                .from('results')
                .select('*')
                .ilike('rider', "%" + rider + "%");
            return results
        }
    })

    return query
}

export const useResultsByRiders = (riders) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['resultsByRider', riders],
        queryFn: async () => {
            let { data: results } = await supabase
                .from('results')
                .select('*')
                .in('rider', riders);
            return results
        }
    })

    return query
}

export const useRiderRankingPerYear = (rider) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['riderRankingPerYear', rider],
        queryFn: async () => {
            let { data: alltimeRankingPerYear } = await supabase
                .from('alltimeRankingPerYear')
                .select('*')
                .ilike('rider', "%" + rider + "%");
            return alltimeRankingPerYear
        }
    })

    return query
}

export const useNationsRankByYear = (nation) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['nationsRankByYear', nation],
        queryFn: async () => {
            let { data: nationsRankByYear } = await supabase
                .from('nationsRankByYear')
                .select('*')
                .eq('nation', nation);
            return nationsRankByYear
        }
    })

    return query
}

export const useNationResultCount = (nation) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['nationResultCount', nation],
        queryFn: async () => {
            let { data: nationResultCount } = await supabase
                .from('nationResultCount')
                .select('*')
                .ilike('nation', "%" + nation + "%");
            return nationResultCount
        }
    })

    return query
}

export const usePointSystemGrouped = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['pointSystemGrouped',],
        queryFn: async () => {
            let { data: pointSystemGrouped } = await supabase
                .from('pointSystemByCategory')
                .select('*');
            return pointSystemGrouped
        }
    })

    return query
}

export const useCalendar = () => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['calendar'],
        queryFn: async () => {
            let { data: calendar } = await supabase
                .from('calendarForShow')
                .select('*');
            return calendar
        }
    })

    return query
}

export const useResultsByYear = (year) => {
    const queryClient = useQueryClient({})

    const query = useQuery({
        queryKey: ['resultsByYear', year],
        queryFn: async () => {
            let { data: resultsByYear } = await supabase
                .from('results')
                .select('*')
                .eq('year', year);
            return resultsByYear;
        }
    })

    return query
}

export const useAlltimePointsPerYearAcc = () => {
    const queryClient = useQueryClient({});

    const query = useQuery({
        queryKey: ["alltimePointsPerYearAcc"],
        queryFn: async () => {
            let { data: alltimePointsPerYearAcc } = await supabase
                .from("alltimeRankingPerYear")
                .select("id, rider, 1876Points, 1876Points, 1877Points, 1878Points, 1879Points, 1880Points, 1881Points, 1882Points, 1883Points, 1884Points, 1885Points, 1886Points, 1887Points, 1888Points, 1889Points, 1890Points, 1891Points, 1892Points, 1893Points, 1894Points, 1895Points, 1896Points, 1897Points, 1898Points, 1899Points, 1900Points, 1901Points, 1902Points, 1903Points, 1904Points, 1905Points, 1906Points, 1907Points, 1908Points, 1909Points, 1910Points, 1911Points, 1912Points, 1913Points, 1914Points, 1915Points, 1916Points, 1917Points, 1918Points, 1919Points, 1920Points, 1921Points, 1922Points, 1923Points, 1924Points, 1925Points, 1926Points, 1927Points, 1928Points, 1929Points, 1930Points, 1931Points, 1932Points, 1933Points, 1934Points, 1935Points, 1936Points, 1937Points, 1938Points, 1939Points, 1940Points, 1941Points, 1942Points, 1943Points, 1944Points, 1945Points, 1946Points, 1947Points, 1948Points, 1949Points, 1950Points, 1951Points, 1952Points, 1953Points, 1954Points, 1955Points, 1956Points, 1957Points, 1958Points, 1959Points, 1960Points, 1961Points, 1962Points, 1963Points, 1964Points, 1965Points, 1966Points, 1967Points, 1968Points, 1969Points, 1970Points, 1971Points, 1972Points, 1973Points, 1974Points, 1975Points, 1976Points, 1977Points, 1978Points, 1979Points, 1980Points, 1981Points, 1982Points, 1983Points, 1984Points, 1985Points, 1986Points, 1987Points, 1988Points, 1989Points, 1990Points, 1991Points, 1992Points, 1993Points, 1994Points, 1995Points, 1996Points, 1997Points, 1998Points, 1999Points, 2000Points, 2001Points, 2002Points, 2003Points, 2004Points, 2005Points, 2006Points, 2007Points, 2008Points, 2009Points, 2010Points, 2011Points, 2012Points, 2013Points, 2014Points, 2015Points, 2016Points, 2017Points, 2018Points, 2019Points, 2020Points, 2021Points, 2022Points, 2023Points, 2024Points"
                )
            return alltimePointsPerYearAcc;
        }
    })

    return query
}