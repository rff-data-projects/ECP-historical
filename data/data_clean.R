library(tidyverse)

df <- read_csv('https://raw.githubusercontent.com/g-dolphin/ECP/master/_dataset/price/ecp_sectors/ecp_sector_CO2.csv') #https://github.com/g-dolphin/ECP/tree/master/_dataset/price/ecp_sectors

df2 <- df %>% select(-CO2_sharesec,-iea_code)

all_juri <- df2$jurisdiction %>% unique()
all_juri <- tibble(jurisdiction = all_juri)

write_csv(all_juri, 'jurisdiction.csv')

ecp_tax <- df2 %>% 
            select(-ecp_ets_kusd, -ecp_all_kusd) %>%
            group_by(jurisdiction, ipcc_code) %>%
            filter(any(ecp_tax_kusd > 0 & !is.na(ecp_tax_kusd))) %>%
            rename(price = ecp_tax_kusd) %>%
            ungroup() %>%
            mutate(price = case_when(price == 0 | is.na(price) ~ 'null',
                                     TRUE ~ as.character(price))
                  )
ecp_ets <- df2 %>% 
            select(-ecp_tax_kusd, -ecp_all_kusd) %>%
            group_by(jurisdiction, ipcc_code) %>%
            filter(any(ecp_ets_kusd > 0 & !is.na(ecp_ets_kusd))) %>%
            rename(price = ecp_ets_kusd) %>%
            ungroup() %>%
            mutate(price = case_when(price == 0 | is.na(price) ~ 'null',
                                     TRUE ~ as.character(price))
            )
ecp_both <- df2 %>% 
              select(-ecp_tax_kusd, -ecp_ets_kusd) %>%
              group_by(jurisdiction, ipcc_code) %>%
              filter(any(ecp_all_kusd > 0 & !is.na(ecp_all_kusd))) %>%
              rename(price = ecp_all_kusd) %>%
              ungroup() %>%
              mutate(price = case_when(price == 0 | is.na(price) ~ 'null',
                                       TRUE ~ as.character(price))
              )

write_csv(ecp_tax, 'ecp_tax.csv')
write_csv(ecp_ets, 'ecp_ets.csv')
write_csv(ecp_both, 'ecp_both.csv')

active_juri <- c(ecp_tax$jurisdiction, ecp_ets$jurisdiction, ecp_both$jurisdiction) %>% unique()
active_juri <- tibble(jurisdiction = active_juri)
write_csv(active_juri, 'active_juri.csv')

