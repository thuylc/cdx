module Reports
  class Site < Base
    def process
      filter['group_by'] = 'day(test.start_time),site.uuid'
      super
    end

    def sites
      site_uuids.inject({}) { |h, uuid| h[uuid] = lookup_site(uuid); h }
    end

    def sort_by_site
      site_results.each do |uuid, results|
        data << [sites[uuid], count_total(results)]
      end
      return self
    end

    def generate_chart
      results = process
      found_data = results.sort_by_site.data
      all_sites = Policy.authorize Policy::Actions::READ_SITE, ::Site.within(@context.entity), @current_user
      sites = all_sites.map { | site | [site.name,0] }
      data = []
      sites.each do | site |
        found_data.each do | found_site_data |
          if site[0].include? found_site_data[0]
            #site[1] = found_site_data[1]
            data << {label: site[0], y: found_site_data[1] }
          end
        end
      end
      { titleY2: 'Companies', columns: data }
    end

    private

    def lookup_site(uuid)
      site = ::Site.where(uuid: uuid).first
      return site.name if site
    end

    def site_results
      results['tests'].group_by { |t| t['site.uuid'] }
    end

    def site_uuids
      site_results.keys
    end
  end
end
