$('#data-table').bootstrapTable({
    columns: [
        {
            field: 'PGN',
            title: 'PGN',
            class:'PGN-class',
            sortable: true,
            visible: true,
        },{
            field: 'PGN_DEC',
            title: 'PGN_DEC',
            class:'PGN_DEC-class',
            sortable: true,
            visible: true,
        },{
            field: 'label',
            title: 'Label',
            class:'label-class',
            sortable: true,
            visible: true
        },{
            field: 'standard',
            title: 'standard',
            class:'standard-class',
            sortable: true,
            visible: true,
        }
    ],
    // sortName: 'DID',
    pagination: false,
    showColumns:true,
    // showColumnsSearch:true,
    search: true,
});

function loadData(){
    $.ajax({
        url: "static/data/J1939_PGN.json",
        type: "GET",
        data: "",
        success: function (result) {
            var data = [];
            $.each(result,function(index,value){
                // console.log(value["PGN"],value)
                data.push({"PGN":"0x"+value["PGN"].padStart(4, '0'),"PGN_DEC":parseInt(value["PGN"],16),"label": value["label"],"standard":value["standard"]});
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
