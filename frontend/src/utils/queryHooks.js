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
                .eq('year', 2023)
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
            return resultsByYear
        }
    })

    return query
}