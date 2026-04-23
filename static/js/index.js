$(document).ready(function() {
    loadPage();
    initSidebar();
});

// Page route mapping
const pageRoutes = {
    'attack_potential_calculator': 'attack_potential_21434_2021_calculator.html',
    'GB_T_45496_2025_calculator': 'GB_T_45496_2025_calculator.html',
    'WMI_lookup': 'WMI_lookup.html',
    'UDS': 'UDS.html',
    'XCP': 'XCP.html',
    'UDS_DID': 'UDS_DID.html',
    'J1939': 'J1939.html',
    'hexview': 'hexview.html',
    'http_scan': 'http_scan.html',
    'JumpX': 'JumpX.html',
    'file_reader': 'file_reader.html',
    'home': 'home.html'
};

// Initialize sidebar functionality
function initSidebar() {
    const $sidebar = $('.sidebar');
    const $overlay = $('#sidebarOverlay');
    const $toggle = $('#sidebarToggle');

    // Close sidebar
    function closeSidebar() {
        $sidebar.removeClass('open');
        $overlay.removeClass('show');
    }

    // Open sidebar
    function openSidebar() {
        $sidebar.addClass('open');
        $overlay.addClass('show');
    }

    // Mobile menu toggle
    $toggle.on('click', openSidebar);
    $overlay.on('click', closeSidebar);

    // Close sidebar when clicking menu item (mobile)
    $('.nav-link').on('click', function() {
        if ($(window).width() <= 768) {
            closeSidebar();
        }
    });

    // Category collapse functionality
    $('.sidebar-category-header').on('click', function() {
        const $header = $(this);
        const category = $header.data('category');
        const $content = $(`.sidebar-category-content[data-category="${category}"]`);

        $header.toggleClass('collapsed');
        $content.toggleClass('collapsed');
    });

    // Search functionality
    $('#sidebarSearch').on('input', function() {
        const keyword = $(this).val().toLowerCase().trim();

        if (keyword === '') {
            resetSearch();
            return;
        }

        filterItems(keyword);
    });

    function resetSearch() {
        $('.sidebar-category-header').show();
        $('.sidebar-category-content').removeClass('collapsed');
        $('.sidebar-menu > li[data-name]').show();
        $('.sidebar-category-content li').show();
        $('#sidebarNoResults').removeClass('show');
    }

    function filterItems(keyword) {
        let hasResults = false;
        const visibleCategories = new Set();

        // Search all items
        $('.sidebar-category-content li[data-name]').each(function() {
            const $item = $(this);
            const name = $item.data('name').toLowerCase();

            if (name.includes(keyword)) {
                $item.show();
                hasResults = true;
                const category = $item.closest('.sidebar-category-content').data('category');
                visibleCategories.add(category);
            } else {
                $item.hide();
            }
        });

        // Show/hide categories
        $('.sidebar-category-header').each(function() {
            const $header = $(this);
            const category = $header.data('category');
            const $content = $(`.sidebar-category-content[data-category="${category}"]`);

            if (visibleCategories.has(category)) {
                $header.show();
                $content.removeClass('collapsed').show();
            } else {
                $header.hide();
                $content.hide();
            }
        });

        // Show no results message
        $('#sidebarNoResults').toggleClass('show', !hasResults);
    }
}

// Load page
function loadPage() {
    const option = getUrlParamValue(location.href, 'option') || 'home';
    const page = pageRoutes[option] || pageRoutes['home'];

    if (pageRoutes[option]) {
        $(`#${option}`).click();
    }

    document.getElementById('content').innerHTML =
        `<iframe src="${page}" style="width: 100%; height: 100%;"></iframe>`;
}

// Menu item selection
$(document).on('click', '.nav-link', function(event) {
    const menu = event.currentTarget.childNodes[2].textContent.trim();

    // Clear all active states
    $('.nav-link').css('background-color', 'transparent');

    // Set current active
    $(event.currentTarget).css('background-color', '#5a5a6f22');

    // Set title
    document.title = menu;
});
