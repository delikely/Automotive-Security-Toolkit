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
            sortable: true,
            class:'WMI-class',
        },{
            field: 'Manufacturer',
            title: 'Manufacturer',
            sortable: true,
            class:'Manufacturer-class',
        }
    ],
    sortName: 'WMI',
    sortOrder: 'desc',
    // pagination: true,
    // showColumns:true,
});

function loadData(){
    $.ajax({
        url: "/static/data/wmi.json",
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
