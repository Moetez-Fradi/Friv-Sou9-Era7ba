import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class ReferenceTest extends JFrame {
    private int a = 1;
    private JLabel beforeLabel;
    private JLabel afterLabel;
    private JLabel numberLabel;

    public ReferenceTest() {
        setTitle("Reference Test");
        setSize(300, 200);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new FlowLayout());

        beforeLabel = new JLabel("Before modify() a = " + a);
        add(beforeLabel);

        afterLabel = new JLabel("After modify() a = " + a);
        add(afterLabel);

        numberLabel = new JLabel("number = ");
        add(numberLabel);

        JButton modifyButton = new JButton("Modify");
        modifyButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                modify(a);
                afterLabel.setText("After modify() a = " + a);
            }
        });
        add(modifyButton);
    }

    void modify(int number) {
        number = number + 1;
        numberLabel.setText("number = " + number);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                ReferenceTest rt = new ReferenceTest();
                rt.setVisible(true);
            }
        });
    }
}