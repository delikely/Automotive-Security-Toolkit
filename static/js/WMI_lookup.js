$('#data-table').bootstrapTable({
    columns: [
        {
            title: 'No.',
            align: 'center',
            formatter: function (value, row, index) {
                var pageSize=$('#data-table').bootstrapTable('getOptions').pageSize;
                var pageNumber=$('#data-table').bootstrapTable('getOptions').pageNumber;
                return pageSize * (pageNumber - 1) + index + 1;
            },
            visible: false,
        },{
            field: 'WMI',
            title: 'WMI',
            class:'WMI-class',
            sortable: true,
        },{
            field: 'Manufacturer',
            title: 'Manufacturer',
            class:'Manufacturer-class',
            sortable: true,
        }
    ],
    sortName: 'WMI',
    sortOrder: 'desc',
    search: true,
    // pagination: true,
    // showColumns:true,
});

function loadData(){
    $.ajax({
        url: "static/data/WMI.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result,function(index,value){
                data.push({"WMI":value["WMI"],"Manufacturer": value["Manufacturer"]});
            });
            $('#data-table').bootstrapTable("load",data);
            $(".bootstrap-table").show();
        }
    });
}

$("#btn-search").click(function () {
    loadData();
})

loadData();
