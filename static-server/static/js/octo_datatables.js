class CompareTables {
    constructor(shared_table_id, common_table_id) {
        this.shared_table_id = shared_table_id;
        this.common_table_id = common_table_id;
        this.profiles = {}

        this.games = {}
        this.controls = document.getElementById('shared_library_table_controls');
        this.shared_library_table = $('#shared_library_table').DataTable({
            autoWidth: false, //<---
            responsive: true,
            columns: [{
                title: "Your Libraries",
            }]
        });
        this.games_in_common_table = $('#games_in_common_table').DataTable({
            columns: [{
                "title": "Game"
            }, {
                "title": "Rating"
            }, {
                "title": "Current Players"
            }]
        });
        this.init();
    }

    init() {
        this.move_controls_to_header();
    }

    get_library_table_content() {
        let columns = [{
            title: "Your Libraries",
        }];
        let common_games = [];
        let columns_to_add_to_table = {};
        let number_of_profiles = Object.keys(this.profiles).length;

        // For each profile in the map, add them to the table.
        let column_iteration_index = 1; // WE skip one for column "Game"
        for (const [steam_id, content] of Object.entries(this.profiles)) {
            columns.push({
                title: '<span steam_id="' + steam_id + '"></span>'
            });
            for (const [game_name, game_id] of Object.entries(content.games)) {

                // Adding all games as a cache for later use.
                if (!(game_name in this.games)) {
                    this.games[game_name] = game_id;
                }

                if (game_name in columns_to_add_to_table) {
                    columns_to_add_to_table[game_name][column_iteration_index] = '✔️'
                } else {
                    columns_to_add_to_table[game_name] = new Array(number_of_profiles + 1)
                        .fill("❌");
                    columns_to_add_to_table[game_name][0] = game_name;
                    columns_to_add_to_table[game_name][column_iteration_index] = '✔️';
                }
            }
            column_iteration_index++;
        }
        for (const [game, row] of Object.entries(columns_to_add_to_table)) {
            if (row.slice(1).every(val => val === '✔️')) {
                common_games.push(game);
            }
        }
        return {
            headers: columns,
            values: Object.values(columns_to_add_to_table),
            common_games: common_games
        };
    }

    position_tooltip() {
        // Get .ktooltiptext sibling
        var tooltip = this.parentNode.querySelector(".ktooltiptext");

        // Get calculated ktooltip coordinates and size
        var ktooltip_rect = this.getBoundingClientRect();

        var tipX = ktooltip_rect.width + 5; // 5px on the right of the ktooltip
        var tipY = -40; // 40px on the top of the ktooltip
        // Position tooltip
        tooltip.style.top = tipY + 'px';
        tooltip.style.left = tipX + 'px';

        // Get calculated tooltip coordinates and size
        var tooltip_rect = tooltip.getBoundingClientRect();
        // Corrections if out of window
        if ((tooltip_rect.x + tooltip_rect.width) > window.innerWidth) // Out on the right
            tipX = -tooltip_rect.width - 5; // Simulate a "right: tipX" position
        if (tooltip_rect.y < 0) // Out on the top
            tipY = tipY - tooltip_rect.y; // Align on the top

        // Apply corrected position
        tooltip.style.top = tipY + 'px';
        tooltip.style.left = tipX + 'px';
    }

    move_controls_to_header() {
        this.controls.appendChild(document.getElementById('shared_library_table_length'));
        this.controls.appendChild(document.getElementById('shared_library_table_filter'));
    }

    delete_controls() {
        var table_id_length = document.getElementById('shared_library_table_length');
        if (table_id_length) table_id_length.remove();
        var table_id_filter = document.getElementById('shared_library_table_filter');
        if (table_id_filter) table_id_filter.remove();
    }

    create_tooltip(header) {
        var profile_id = this.profiles[header.getAttribute('steam_id')];

        // Sets the header to have a hover class for the tooltip.
        header.className = 'ref';

        var container = document.createElement('div');
        container.className = 'flex-container';

        // Tooltip div.
        var div = document.createElement('div');
        div.className = 'ktooltip';
        div.addEventListener("mouseover", this.position_tooltip);

        // Hover object that activates the tooltip.
        var img = document.createElement('img');
        img.src = profile_id.avatar;
        div.appendChild(img);

        var name = document.createElement('div');
        name.innerText = profile_id.personaname;

        var cross_div = document.createElement('div');
        cross_div.className = 'cross';

        var cross = document.createElement('i');
        cross.classList = 'fa-solid fa-ban';

        var _self = this;
        cross.addEventListener("click", function () {
            var steam_id = header.getAttribute('steam_id');
            delete _self.profiles[steam_id];
            _self.update_tables();

        });
        cross_div.appendChild(cross);
        container.appendChild(div);
        container.appendChild(name);
        container.appendChild(cross_div);

        header.prepend(container);
    }

    write_games_in_common_table(data_table_content) {

        // Clear the common games table.
        this.games_in_common_table.clear();

        // Add the new games in common to the table.
        fetch('http://' + api_host + ':' + api_port + '/ratings', {
            method: 'POST',
            body: JSON.stringify({
                "ids": listOfGameNamesToIds(data_table_content.common_games, this.games),
                "games": data_table_content.common_games
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()).then(data => {

            // Writes list [game, rating, current players] to the table.
            for (var index = 0; index < data[0].length; index++) {
                this.games_in_common_table.row.add([data[0][index].game, data[0][index]
                    .rating, data[1][index].count
                ]);
            }
            this.games_in_common_table.draw();
        });
    }

    update_tables() {
        var data_table_content = this.get_library_table_content()

        // Destroy old table..
        this.shared_library_table.destroy();
        $('#shared_library_table').empty();

        this.delete_controls();

        // Reinitalize table.
        this.shared_library_table = $('#shared_library_table').DataTable({
            autoWidth: false, //<---
            responsive: true,
            columns: data_table_content.headers,
            data: data_table_content.values,
        });

        this.move_controls_to_header();

        this.shared_library_table.columns.adjust().responsive.recalc();
        this.shared_library_table.draw();

        // Update the headers of each column in the table.
        var events = $('#shared_library_table thead th span')
        for (var i = 0; i < events.length; i++) {
            this.create_tooltip(events[i]);
        }

        // Write the games in common table.
        if (Object.keys(this.profiles).length > 1) {
            this.write_games_in_common_table(data_table_content);
        } else {
            // Clear the common games table.
            console.log("Clear the table...");
            this.games_in_common_table.clear();
            this.games_in_common_table.draw();
        }
    }
}